
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveBooks } from "@/lib/storage";
import { useTheme } from "@/components/ThemeProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  
  const handleClearLibrary = () => {
    if (confirm("Are you sure you want to clear your library? This action cannot be undone.")) {
      saveBooks([]);
      toast.success("Library cleared successfully");
    }
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the Reading Hub looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="sepia">Sepia</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose a theme for the entire application
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              These actions cannot be undone. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Clear Library</h3>
              <p className="text-sm text-muted-foreground mb-2">
                This will remove all books and reading data from your library.
                Your data is stored locally and this action cannot be reversed.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleClearLibrary}
              >
                Clear Library
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground border-t pt-4">
            <p>
              Note: All data is stored locally in your browser. Clearing your browser data
              will also clear your Reading Hub library.
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground">
                Thinkpalm Reading Hub — A personal PDF book library designed to offer
                a natural and immersive reading experience.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                © Vijith V T. All Rights Reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
