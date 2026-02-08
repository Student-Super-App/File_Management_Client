import { useState } from "react";
import { useAppSelector } from "@/app/store/store";
import { 
  useApiKeys, 
  useCreateApiKey, 
  useDeleteApiKey,
  useDeactivateApiKey,
  useReactivateApiKey,
  useRotateApiKey
} from "@/hooks";
import { PageHeader, EmptyState, ConfirmationModal, CommonTable, type ColumnDef } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Key, 
  Plus, 
  Trash, 
  MoreHorizontal,
  RefreshCw,
  Power,
  PowerOff,
  Loader2,
  Download
} from "lucide-react";
import type { ApiKeyScope, ApiKey } from "@/types";

// ============================================
// API KEYS PAGE
// ============================================

export function ApiKeysPage() {
  const { activeProjectId } = useAppSelector((state) => state.auth);
  const { data: apiKeys, isLoading } = useApiKeys(activeProjectId || undefined);
  const createMutation = useCreateApiKey();
  const deleteMutation = useDeleteApiKey();
  const deactivateMutation = useDeactivateApiKey();
  const reactivateMutation = useReactivateApiKey();
  const rotateMutation = useRotateApiKey();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });
  
  // Form state
  const [keyName, setKeyName] = useState("");
  const [keyPrefix, setKeyPrefix] = useState("sk_live");
  const [selectedScopes, setSelectedScopes] = useState<ApiKeyScope[]>(["read"]);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDays, setExpiryDays] = useState("30");

  const availableScopes: ApiKeyScope[] = ["read", "upload", "delete"];

  const toggleScope = (scope: ApiKeyScope) => {
    setSelectedScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  const downloadKeyAsJson = (keyData: any) => {
    const jsonData = JSON.stringify(keyData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${keyData.name || 'api-key'}-${keyData.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreate = async () => {
    if (!activeProjectId || !keyName.trim()) return;
    
    const expiresAt = hasExpiry 
      ? new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const response = await createMutation.mutateAsync({
      projectId: activeProjectId,
      name: keyName,
      scopes: selectedScopes,
      prefix: keyPrefix || undefined,
      expiresAt,
    });

    // Store newly created key for download
    if (response.data) {
      setNewlyCreatedKey(response.data);
    }

    // Reset form
    setKeyName("");
    setKeyPrefix("sk_live");
    setSelectedScopes(["read"]);
    setHasExpiry(false);
    setExpiryDays("30");
    setIsCreateOpen(false);
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      open: true,
      title: "Delete API Key",
      description: "Are you sure you want to delete this API key? This action cannot be undone.",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
    });
  };

  const handleDeactivate = async (id: string) => {
    setConfirmModal({
      open: true,
      title: "Deactivate API Key",
      description: "Deactivate this API key? It can be reactivated later.",
      onConfirm: async () => {
        await deactivateMutation.mutateAsync(id);
      },
    });
  };

  const handleReactivate = async (id: string) => {
    await reactivateMutation.mutateAsync(id);
  };

  const handleRotate = async (id: string) => {
    setConfirmModal({
      open: true,
      title: "Rotate API Key",
      description: "Rotate this API key? The old key will be invalidated and a new one will be generated.",
      onConfirm: async () => {
        await rotateMutation.mutateAsync(id);
      },
    });
  };

  // Table columns definition
  const columns: ColumnDef<ApiKey>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      accessorKey: "key",
      header: "Key",
      cell: (row) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {row.keyPreview || `${row.prefix || "sk"}_••••••••••••••••••••••••`}
        </code>
      ),
    },
    {
      accessorKey: "scopes",
      header: "Scopes",
      cell: (row) => (
        <div className="flex gap-1 flex-wrap">
          {(row.scopes || []).map((scope: string) => (
            <Badge key={scope} variant="secondary" className="text-xs">
              {scope}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => {
        const isExpired = row.expiresAt && new Date(row.expiresAt) < new Date();
        const isActive = row.isActive !== false;
        
        if (isExpired) {
          return <Badge variant="destructive">Expired</Badge>;
        }
        return isActive ? (
          <Badge className="bg-success text-primary-foreground">Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : "Never"}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      maxSize: "70px",
      cell: (row) => {
        const keyId = row.id || row._id || "";
        const isActive = row.isActive !== false;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isActive ? (
                <DropdownMenuItem
                  onClick={() => handleDeactivate(keyId)}
                  disabled={deactivateMutation.isPending}
                >
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleReactivate(keyId)}
                  disabled={reactivateMutation.isPending}
                >
                  <Power className="mr-2 h-4 w-4" />
                  Reactivate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleRotate(keyId)}
                disabled={rotateMutation.isPending}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Rotate Key
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(keyId)}
                className="text-destructive"
                disabled={deleteMutation.isPending}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (!activeProjectId) {
    return (
      <div className="space-y-6">
        <PageHeader title="API Keys" description="Manage your API keys." />
        <EmptyState
          icon={<Key className="h-8 w-8" />}
          title="No project selected"
          description="Please select a project to view its API keys."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Create and manage API keys for authentication."
      >
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for this project. Make sure to copy it - you won't be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name *</Label>
                <Input
                  id="keyName"
                  placeholder="Production API Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyPrefix">Key Prefix</Label>
                <Input
                  id="keyPrefix"
                  placeholder="sk_live"
                  value={keyPrefix}
                  onChange={(e) => setKeyPrefix(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  E.g., sk_live, sk_test, sk_dev
                </p>
              </div>

              <div className="space-y-3">
                <Label>Permissions *</Label>
                <div className="space-y-2">
                  {availableScopes.map((scope) => (
                    <div key={scope} className="flex items-center space-x-2">
                      <Checkbox
                        id={`scope-${scope}`}
                        checked={selectedScopes.includes(scope)}
                        onCheckedChange={() => toggleScope(scope)}
                      />
                      <label
                        htmlFor={`scope-${scope}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {scope}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasExpiry"
                    checked={hasExpiry}
                    onCheckedChange={(checked) => setHasExpiry(checked === true)}
                  />
                  <label
                    htmlFor="hasExpiry"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Set expiration date
                  </label>
                </div>
                {hasExpiry && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="expiryDays">Expires in (days)</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      placeholder="30"
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(e.target.value)}
                      min="1"
                      max="365"
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !keyName.trim() || selectedScopes.length === 0}
                className="w-full"
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* New Key Created Alert */}
      {newlyCreatedKey && (
        <Card className="border-success bg-success/5">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-success/10 p-2">
                  <Key className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">API Key Created Successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    {newlyCreatedKey.message || "Store the key securely - it cannot be retrieved again."}
                  </p>
                  <div className="mt-3 rounded-md bg-muted p-3 font-mono text-sm break-all">
                    {newlyCreatedKey.key}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => downloadKeyAsJson(newlyCreatedKey)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download as JSON
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setNewlyCreatedKey(null)}
                    >
                      I've Saved It
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <CommonTable
            columns={columns}
            data={apiKeys || []}
            isLoading={isLoading}
            emptyIcon={<Key className="h-8 w-8" />}
            emptyTitle="No API keys"
            emptyDescription="Create an API key to start using the API."
            emptyAction={
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            }
            getRowKey={(row) => row.id || row._id || ""}
          />
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        isLoading={deleteMutation.isPending || deactivateMutation.isPending || rotateMutation.isPending}
      />
    </div>
  );
}

export default ApiKeysPage;
