import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Eye, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeImage as analyzeImageAPI } from "@/api/drApi";

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      toast({ title: "Invalid file type", description: "Please upload an image file", variant: "destructive" });
    }
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => e.preventDefault(), []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreview(null);
    setProgress(0);
  };

  // ✅ Updated analyzeImage function
  const analyzeImage = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 100));
    }, 200);

    try {
      const result = await analyzeImageAPI(uploadedFile); // call backend
      navigate("/results", { state: { result } });
    } catch (err) {
      console.error(err);
      toast({ title: "Analysis Failed", variant: "destructive" });
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Upload Retinal Image
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload a fundus photograph for AI-powered diabetic retinopathy analysis
        </p>
      </div>

      {/* Upload Area */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="pt-6">
          {!uploadedFile ? (
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Drop your retinal image here
                  </h3>
                  <p className="text-muted-foreground mb-4">or click to browse files</p>
                  <Button variant="outline">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              </div>
              <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Image Preview</h3>
                  <Button variant="ghost" size="sm" onClick={removeFile} disabled={isAnalyzing}><X className="w-4 h-4" /></Button>
                </div>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <img src={preview || ''} alt="Retinal preview" className="w-full h-96 object-contain" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 text-white">{uploadedFile.name}</Badge>
                  </div>
                </div>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <Card className="bg-muted/30 border-0">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="font-medium text-foreground">Analyzing retinal image...</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analyze Button */}
              <div className="flex justify-center">
                <Button variant="medical" size="lg" onClick={analyzeImage} disabled={isAnalyzing} className="px-8 py-4 text-lg">
                  {isAnalyzing ? <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</> : <> <Eye className="w-5 h-5 mr-2" /> Analyze Image </>}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
