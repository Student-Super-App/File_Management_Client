import { useState } from "react";
import { useAppSelector } from "@/app/store/store";
import { useAssets } from "@/hooks";
import { PageHeader, EmptyState, TableSkeleton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, Search, Grid, List, Download, Trash } from "lucide-react";

// ============================================
// ASSETS PAGE
// ============================================

export function AssetsPage() {
  const { activeProjectId } = useAppSelector((state) => state.auth);
  const [page] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: assetsData, isLoading } = useAssets(
    activeProjectId || "",
    page,
    20,
    {
      search: search || undefined,
      type: typeFilter !== "all" ? (typeFilter as "image" | "video" | "document" | "other") : undefined,
    }
  );

  if (!activeProjectId) {
    return (
      <div className="space-y-6">
        <PageHeader title="Assets" description="Browse and manage your files." />
        <EmptyState
          icon={<Image className="h-8 w-8" />}
          title="No project selected"
          description="Please select a project to view its assets."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Browse and manage your uploaded files."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Assets Grid/List */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : !assetsData?.data?.length ? (
            <EmptyState
              icon={<Image className="h-8 w-8" />}
              title="No assets found"
              description="Upload files to see them here."
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {assetsData.data.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative aspect-square rounded-lg border bg-muted overflow-hidden"
                >
                  {asset.type === "image" ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {assetsData.data.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(asset.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Badge variant="secondary">{asset.type}</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AssetsPage;
