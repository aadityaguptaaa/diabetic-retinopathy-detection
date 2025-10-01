import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Download,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data for patient reports
  const recentReports = [
    {
      id: '1',
      date: '2024-01-15',
      status: 'No DR',
      confidence: 95,
      eye: 'Left',
      downloadUrl: '#'
    },
    {
      id: '2', 
      date: '2024-01-10',
      status: 'Mild NPDR',
      confidence: 88,
      eye: 'Right',
      downloadUrl: '#'
    },
    {
      id: '3',
      date: '2024-01-05',
      status: 'No DR',
      confidence: 97,
      eye: 'Left', 
      downloadUrl: '#'
    }
  ];

  const getStatusColor = (status: string) => {
    if (status === 'No DR') return 'bg-success text-success-foreground';
    if (status.includes('Mild')) return 'bg-warning text-warning-foreground';
    if (status.includes('Moderate')) return 'bg-destructive text-destructive-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const upcomingReminders = [
    {
      id: '1',
      title: 'Next Screening Due',
      date: '2024-02-15',
      type: 'screening'
    },
    {
      id: '2', 
      title: 'Follow-up Appointment',
      date: '2024-02-10',
      type: 'appointment'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-white/90">
          Stay on top of your eye health with regular retinal screenings.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>New Screening</span>
            </CardTitle>
            <CardDescription>
              Upload a new retinal image for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="medical" 
              className="w-full"
              onClick={() => navigate('/upload')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Retinal Image
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Reports</span>
            </CardTitle>
            <CardDescription>
              View and download your screening reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/reports')}
            >
              <FileText className="w-4 h-4 mr-2" />
              View All Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-primary" />
            <span>Recent Screenings</span>
          </CardTitle>
          <CardDescription>
            Your latest retinal screening results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {report.eye} Eye Screening
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {report.confidence}% confidence
                  </span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reminders & Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Upcoming</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reminder.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Health Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Screenings</span>
                <span className="font-semibold text-foreground">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Screening</span>
                <span className="font-semibold text-foreground">5 days ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status Trend</span>
                <Badge className="bg-success text-success-foreground">Stable</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;