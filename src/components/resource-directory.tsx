import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Phone } from "lucide-react";

const crisisResources = [
  {
    name: "National Suicide Prevention Lifeline",
    number: "988",
    description: "24/7, free and confidential support for people in distress.",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "Free, 24/7 crisis support via text message.",
  },
];

const onlineResources = [
  {
    name: "NAMI (National Alliance on Mental Illness)",
    url: "https://www.nami.org",
    description: "Advocacy, education, support, and public awareness.",
  },
  {
    name: "Mental Health America (MHA)",
    url: "https://www.mhanational.org",
    description: "Promoting mental health as a critical part of overall wellness.",
  },
  {
    name: "The Trevor Project",
    url: "https://www.thetrevorproject.org",
    description: "Support for LGBTQ young people in crisis.",
  },
];

export default function ResourceDirectory() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">In Crisis? Help is available.</CardTitle>
          <CardDescription className="text-destructive/80">
            If you are in immediate danger, please call 911. For urgent support, reach out to these resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {crisisResources.map((resource) => (
            <div key={resource.name} className="flex items-start gap-4">
              <Phone className="h-6 w-6 mt-1 text-destructive" />
              <div>
                <p className="font-semibold">{resource.name}</p>
                <p className="text-lg font-bold text-destructive">{resource.number}</p>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Helpful Websites & Information</CardTitle>
          <CardDescription>
            Explore these organizations for information, support, and community.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {onlineResources.map((resource) => (
            <div key={resource.name} className="flex items-start gap-4">
              <Globe className="h-5 w-5 mt-1 text-primary" />
              <div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  {resource.name}
                </a>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
