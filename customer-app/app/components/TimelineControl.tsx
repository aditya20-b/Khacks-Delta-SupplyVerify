import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { PackageLocation } from "../types/supply-chain"
import { Play, Pause } from "lucide-react"

interface TimelineControlProps {
  locations: PackageLocation[]
  currentTime: Date
  isPlaying: boolean
  onPlayPause: () => void
  onTimeChange: (time: Date) => void
  totalDuration: number
}

export function TimelineControl({
  locations,
  currentTime,
  isPlaying,
  onPlayPause,
  onTimeChange,
  totalDuration,
}: TimelineControlProps) {
  const startTime = locations[0].timestamp

  const currentProgress = useMemo(() => {
    return ((currentTime.getTime() - startTime.getTime()) / totalDuration) * 100
  }, [currentTime, startTime, totalDuration])

  const handleSliderChange = (value: number[]) => {
    const newTime = new Date(startTime.getTime() + (totalDuration * value[0]) / 100)
    onTimeChange(newTime)
  }

  const formatTimeDisplay = (time: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(time)
  }

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
      <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 w-[400px]">
        <div className="flex items-center space-x-6">
          <Button 
            onClick={onPlayPause} 
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center"
          >
            {isPlaying ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4 ml-0.5" />
            }
          </Button>
          <div className="flex-grow relative">
            {/* Location Markers Layer */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-20">
              <TooltipProvider delayDuration={0}>
                {locations.map((location) => {
                  const left = ((location.timestamp.getTime() - startTime.getTime()) / totalDuration) * 100
                  return (
                    <Tooltip key={location.id}>
                      <TooltipTrigger asChild>
                        <button
                          className="absolute w-3 h-3 -mt-1.5 transform -translate-x-1/2 cursor-pointer hover:scale-150 transition-transform duration-200"
                          style={{ left: `${left}%` }}
                          type="button"
                        >
                          <div className={`w-full h-full rounded-full border border-black/20
                            ${location.type === 'start' ? 'bg-green-500' :
                              location.type === 'end' ? 'bg-red-500' :
                              location.type === 'port' ? 'bg-blue-500' :
                              location.type === 'airport' ? 'bg-purple-500' :
                              'bg-yellow-500'}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={5}>
                        <div className="text-xs">
                          <p className="font-medium">{location.name}</p>
                          <p className="text-muted-foreground">{formatTimeDisplay(location.timestamp)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </TooltipProvider>
            </div>
            {/* Slider Layer */}
            <div className="relative z-10">
              <Slider 
                value={[currentProgress]} 
                max={100} 
                step={0.1} 
                onValueChange={handleSliderChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-white/60 text-sm font-medium">
        {formatTimeDisplay(currentTime)}
      </div>
    </div>
  )
}

