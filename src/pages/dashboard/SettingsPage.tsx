import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  setTheme,
  setRadius,
  setFontScale,
  setSidebarDensity,
  setColors,
  resetSettings,
} from "@/app/store/settingsSlice";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themePresets, radiusOptions, fontScaleOptions } from "@/config/theme";
import type { ThemeMode, RadiusSize, FontScale, SidebarDensity } from "@/types/index";
import { RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// SETTINGS PAGE
// ============================================

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const handleThemeChange = (theme: ThemeMode) => {
    dispatch(setTheme(theme));
  };

  const handleRadiusChange = (radius: RadiusSize) => {
    dispatch(setRadius(radius));
  };

  const handleFontScaleChange = (scale: FontScale) => {
    dispatch(setFontScale(scale));
  };

  const handleSidebarDensityChange = (density: SidebarDensity) => {
    dispatch(setSidebarDensity(density));
  };

  const handlePresetChange = (preset: (typeof themePresets)[0]) => {
    dispatch(
      setColors({
        primary: preset.primary,
        secondary: preset.secondary,
      })
    );
  };

  const handleReset = () => {
    dispatch(resetSettings());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Customize your dashboard experience."
      >
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </Button>
      </PageHeader>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as ThemeMode[]).map((theme) => (
                <Button
                  key={theme}
                  variant={settings.theme === theme ? "default" : "outline"}
                  onClick={() => handleThemeChange(theme)}
                  className="capitalize"
                >
                  {theme}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-2">
            <Label>Color Theme</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themePresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetChange(preset)}
                  className={cn(
                    "relative p-4 rounded-lg border text-left transition-all",
                    settings.colors.primary === preset.primary
                      ? "border-primary ring-2 ring-primary"
                      : "hover:border-primary/50"
                  )}
                >
                  {settings.colors.primary === preset.primary && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex gap-2 mb-2">
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <p className="font-medium">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Select
              value={settings.radius}
              onValueChange={(value) => handleRadiusChange(value as RadiusSize)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {radiusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.pixels})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Scale */}
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select
              value={settings.fontScale}
              onValueChange={(value) => handleFontScaleChange(value as FontScale)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontScaleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.size})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sidebar Density */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Compact Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Use tighter spacing in the sidebar
              </p>
            </div>
            <Switch
              checked={settings.sidebarDensity === "compact"}
              onCheckedChange={(checked) =>
                handleSidebarDensityChange(checked ? "compact" : "comfortable")
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="font-medium">Card Component</p>
              <p className="text-sm text-muted-foreground">
                This is how your cards will look with current settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
