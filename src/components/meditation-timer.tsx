"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import * as React from "react";
import { SceneWrapper } from "./3d/scene-wrapper";
import { FloatingOrb } from "./3d/floating-orb";
import { ProgressRing } from "./3d/progress-ring";
import { motion, AnimatePresence } from "framer-motion";

const meditationDurations = [
  { value: 300, label: "5 minutes" },
  { value: 600, label: "10 minutes" },
  { value: 900, label: "15 minutes" },
  { value: 1200, label: "20 minutes" },
  { value: 1800, label: "30 minutes" },
];

const ambientSounds = [
  { value: "none", label: "Silence" },
  { value: "rain", label: "Rain" },
  { value: "ocean", label: "Ocean Waves" },
  { value: "forest", label: "Forest" },
  { value: "bells", label: "Tibetan Bells" },
];

export default function MeditationTimer() {
  const [duration, setDuration] = React.useState(600); // 10 minutes default
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isActive, setIsActive] = React.useState(false);
  const [selectedSound, setSelectedSound] = React.useState("none");
  const [isMuted, setIsMuted] = React.useState(false);
  const [sessions, setSessions] = React.useState(0);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const savedSessions = localStorage.getItem("meditation-sessions");
    if (savedSessions) {
      setSessions(parseInt(savedSessions, 10));
    }
  }, []);

  React.useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    const newSessionCount = sessions + 1;
    setSessions(newSessionCount);
    localStorage.setItem("meditation-sessions", newSessionCount.toString());
    
    // Show completion notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Meditation Complete! 🧘', {
        body: 'Great job on completing your meditation session.',
        icon: '/favicon.ico'
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const handleDurationChange = (newDuration: string) => {
    const durationValue = parseInt(newDuration, 10);
    setDuration(durationValue);
    if (!isActive) {
      setTimeLeft(durationValue);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const isCompleted = timeLeft === 0 && !isActive;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧘 Meditation Timer
            </CardTitle>
            <CardDescription>
              Take a moment to center yourself with guided meditation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Select 
                  value={duration.toString()} 
                  onValueChange={handleDurationChange}
                  disabled={isActive}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {meditationDurations.map((d) => (
                      <SelectItem key={d.value} value={d.value.toString()}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ambient Sound</label>
                <Select value={selectedSound} onValueChange={setSelectedSound}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ambientSounds.map((sound) => (
                      <SelectItem key={sound.value} value={sound.value}>
                        {sound.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center space-y-4">
              <motion.div
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-6xl font-mono font-bold text-primary"
              >
                {formatTime(timeLeft)}
              </motion.div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="rounded-full w-16 h-16"
                >
                  {isActive ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-16 h-16"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>

                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-16 h-16"
                  disabled={selectedSound === "none"}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary">
                  Sessions completed: {sessions}
                </Badge>
                {isCompleted && (
                  <Badge variant="default" className="bg-green-600">
                    ✨ Session Complete!
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <CardTitle>Meditation Visualization</CardTitle>
            <CardDescription>
              Focus on the peaceful 3D environment
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <SceneWrapper>
              <ProgressRing 
                progress={progress} 
                radius={2} 
                thickness={0.1}
                color={isActive ? "#10B981" : "#78A0D3"}
                label={isActive ? "Breathe" : "Ready"}
              />
              
              {/* Breathing orbs that pulse with meditation rhythm */}
              <FloatingOrb
                position={[-3, 0, 0]}
                color="#60A5FA"
                speed={isActive ? 0.2 : 0.5}
                distort={isActive ? 0.5 : 0.2}
              />
              <FloatingOrb
                position={[3, 0, 0]}
                color="#34D399"
                speed={isActive ? 0.2 : 0.5}
                distort={isActive ? 0.5 : 0.2}
              />
              <FloatingOrb
                position={[0, 3, -1]}
                color="#F472B6"
                speed={isActive ? 0.2 : 0.5}
                distort={isActive ? 0.5 : 0.2}
              />
              <FloatingOrb
                position={[0, -3, -1]}
                color="#FBBF24"
                speed={isActive ? 0.2 : 0.5}
                distort={isActive ? 0.5 : 0.2}
              />
            </SceneWrapper>
          </CardContent>
        </Card>
      </div>

      {isActive && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-blue-900">
                Meditation in Progress
              </h3>
              <p className="text-blue-700">
                Focus on your breath. Inhale peace, exhale tension.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-sm text-blue-600">
                  <span className="font-medium">Inhale</span> for 4 seconds
                </div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <div className="text-sm text-blue-600">
                  <span className="font-medium">Exhale</span> for 6 seconds
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}