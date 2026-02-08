import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ============================================
// DOCS PAGE
// ============================================

export function DocsPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold">Documentation</h1>
            <p className="mt-2 text-muted-foreground">
              Everything you need to integrate FileCloud into your application.
            </p>
          </div>

          {/* Quick Start */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
              <Tabs defaultValue="javascript">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`import { FileCloud } from '@filecloud/sdk';

const client = new FileCloud({
  apiKey: 'your-api-key'
});

// Upload a file
const result = await client.upload(file);
console.log(result.url);`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="python" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`from filecloud import FileCloud

client = FileCloud(api_key='your-api-key')

# Upload a file
result = client.upload(file)
print(result.url)`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="curl" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`curl -X POST https://api.filecloud.dev/v1/upload \\
  -H "Authorization: Bearer your-api-key" \\
  -F "file=@/path/to/file.jpg"`}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* API Reference */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">API Reference</h2>

            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-success text-primary-foreground text-xs px-2 py-1 rounded">
                      POST
                    </span>
                    <code className="text-sm">/v1/upload</code>
                  </div>
                  <p className="text-muted-foreground">
                    Upload a file to your project.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-info text-primary-foreground text-xs px-2 py-1 rounded">
                      GET
                    </span>
                    <code className="text-sm">/v1/assets</code>
                  </div>
                  <p className="text-muted-foreground">
                    List all assets in your project.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                      DELETE
                    </span>
                    <code className="text-sm">/v1/assets/:id</code>
                  </div>
                  <p className="text-muted-foreground">Delete an asset by ID.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocsPage;
