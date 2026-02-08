import { useState } from "react";
import { useProjects, useCreateProject, useDeleteProject } from "@/hooks";
import { PageHeader, EmptyState, ConfirmationModal, CommonTable, type ColumnDef } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderKanban,
  Plus,
  MoreHorizontal,
  Trash,
  Settings,
  Key,
  Loader2,
  Search,
  LayoutGrid,
  Table2,
} from "lucide-react";
import type { StorageProvider, Project } from "@/types";

// ============================================
// PROJECTS PAGE
// ============================================

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const createMutation = useCreateProject();
  const deleteMutation = useDeleteProject();

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState<StorageProvider>("aws");
  const [maxFileSize, setMaxFileSize] = useState("100"); // MB
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });

  // Filter projects based on search
  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    
    await createMutation.mutateAsync({
      name: newProjectName,
      description: description || undefined,
      provider,
      providerConfig: {}, // Empty config for now
      allowedMimeTypes: ["image/*", "video/*", "application/pdf"],
      maxFileSizeBytes: parseInt(maxFileSize) * 1024 * 1024, // Convert MB to bytes
    });
    
    // Reset form
    setNewProjectName("");
    setDescription("");
    setProvider("aws");
    setMaxFileSize("100");
    setIsCreateOpen(false);
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      open: true,
      title: "Delete Project",
      description: "Are you sure you want to delete this project? This action cannot be undone and will delete all associated data.",
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
    });
  };

  // Table columns definition
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: (row) => <span className="text-muted-foreground">{row.slug}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      maxSize: "70px",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Key className="mr-2 h-4 w-4" />
              API Keys
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.id || row._id || "")}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Manage your file storage projects and providers">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="My Awesome Project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Storage for my application assets"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Storage Provider *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProvider("aws")}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      provider === "aws"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">AWS S3</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Amazon Web Services
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider("cloudinary")}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      provider === "cloudinary"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">Cloudinary</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Media management
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  placeholder="100"
                  value={maxFileSize}
                  onChange={(e) => setMaxFileSize(e.target.value)}
                  min="1"
                  max="5000"
                />
                <p className="text-xs text-muted-foreground">
                  Default: 100 MB. Allowed types: Images, Videos, PDFs
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Security Note:</strong> Provider credentials (Access Keys, API Secrets) are securely managed on the server.
                </p>
              </div>

              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <Button
            variant={viewMode === "card" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("card")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="gap-2"
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-2">
              <EmptyState
                icon={<FolderKanban className="h-8 w-8" />}
                title="No projects yet"
                description={searchQuery ? "No projects match your search." : "Create your first project to get started with file management."}
                action={!searchQuery && (
                  <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Button>
                )}
              />
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id || project._id} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          variant="secondary"
                          className={
                            project.provider === "aws"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          }
                        >
                          {project.provider === "aws" ? "AWS S3" : "Cloudinary"}
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {project.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="mr-2 h-4 w-4" />
                          API Keys
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(project.id || project._id || "")}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Slug:</span>
                      <span className="font-mono">{project.slug}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max File Size:</span>
                      <span className="font-medium">
                        {project.maxFileSizeBytes ? (project.maxFileSizeBytes / 1024 / 1024).toFixed(0) : 'N/A'} MB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allowed Types:</span>
                      <span className="font-medium">
                        {project.allowedMimeTypes?.length || 0} types
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="pt-6">
            <CommonTable
              columns={columns}
              data={filteredProjects}
              isLoading={isLoading}
              emptyIcon={<FolderKanban className="h-8 w-8" />}
              emptyTitle="No projects yet"
              emptyDescription={searchQuery ? "No projects match your search." : "Create your first project to get started with file management."}
              emptyAction={!searchQuery && (
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              )}
              getRowKey={(row) => row.id || row._id || ""}
            />
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default ProjectsPage;
