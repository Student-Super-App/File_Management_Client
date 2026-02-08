import { PageHeader } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Code } from "lucide-react";

// ============================================
// UPLOADS PAGE (Documentation)
// ============================================

export function UploadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Uploads"
        description="Learn how to upload files to your project."
      />

      <Tabs defaultValue="sdk" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sdk">SDK</TabsTrigger>
          <TabsTrigger value="api">REST API</TabsTrigger>
          <TabsTrigger value="widget">Widget</TabsTrigger>
        </TabsList>

        <TabsContent value="sdk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Using the JavaScript SDK
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Installation</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>npm install @filecloud/sdk</code>
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Basic Upload</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`import { FileCloud } from '@filecloud/sdk';

const client = new FileCloud({
  apiKey: 'your-api-key'
});

// Upload from file input
const input = document.querySelector('input[type="file"]');
const file = input.files[0];

const result = await client.upload(file);
console.log('Uploaded:', result.url);`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Upload with Options</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`const result = await client.upload(file, {
  folder: 'avatars',
  tags: ['user', 'profile'],
  transformation: {
    width: 200,
    height: 200,
    crop: 'fill'
  }
});`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Using the REST API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Upload Endpoint</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`POST https://api.filecloud.dev/v1/upload
Authorization: Bearer your-api-key
Content-Type: multipart/form-data`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">cURL Example</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`curl -X POST https://api.filecloud.dev/v1/upload \\
  -H "Authorization: Bearer your-api-key" \\
  -F "file=@/path/to/image.jpg" \\
  -F "folder=avatars"`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widget">
          <Card>
            <CardHeader>
              <CardTitle>Upload Widget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Use our pre-built upload widget for a quick integration.
              </p>

              <div>
                <h4 className="font-medium mb-2">Embed the Widget</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`<script src="https://widget.filecloud.dev/v1/upload.js"></script>

<button onclick="FileCloud.openUploadWidget({
  apiKey: 'your-api-key',
  onSuccess: (result) => console.log(result)
})">
  Upload File
</button>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UploadsPage;
