# Module Federation Test Mocks

このディレクトリには、`@module-federation/native-federation-tests`を使用して生成されたテスト用のモックが含まれています。

## セットアップ

### 1. atomic-sharedでモックを生成

atomic-sharedプロジェクトをビルドすると、自動的にテスト用のモックが生成されます：

```bash
cd atomic-shared
npm run build
```

これにより、`atomic-shared/dist/@mf-tests.zip`が生成されます。

### 2. モックをダウンロード

atomic-sharedのdevサーバーを起動してから、モックをダウンロードします：

```bash
# atomic-sharedのdevサーバーを起動
cd atomic-shared
npm run dev

# 別のターミナルで、my-react-router-appからモックをダウンロード
cd my-react-router-app
mkdir -p __mocks__/@mf/atomicShared
cd __mocks__/@mf/atomicShared
curl -O http://localhost:5002/dist/@mf-tests.zip
unzip -o @mf-tests.zip
rm @mf-tests.zip
```

## テストでの使用

テストファイルで、生成されたモックを使用します：

```typescript
// Mock RemoteComponents with federated mocks
vi.mock('../RemoteComponents', () => {
  // Use require for CommonJS modules
  const { FormField } = require('../../../__mocks__/@mf/atomicShared/FormField.cjs');
  const { Button } = require('../../../__mocks__/@mf/atomicShared/Button.cjs');
  
  return {
    RemoteFormField: FormField,
    RemoteButton: Button,
  };
});
```

## 利点

- **実際のコンポーネント**: 手動でモックを作成する代わりに、実際のatomic-sharedコンポーネントを使用
- **型安全性**: 実際のコンポーネントの型定義を使用
- **保守性**: atomic-sharedが更新されたら、モックを再生成するだけ
- **一貫性**: 本番環境と同じコンポーネントでテスト

## 注意事項

- atomic-sharedを更新したら、モックを再ダウンロードする必要があります
- モックファイルはCommonJS形式で生成されるため、`require()`を使用してインポートします
