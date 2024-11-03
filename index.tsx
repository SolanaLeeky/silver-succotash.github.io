import React, { forwardRef, useRef, useState, useEffect } from "react";
import { Education as EducationType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DotPattern } from "@/components/ui/dot-pattern";

interface EducationProps {
  education: EducationType[];
}

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className,
        )}
      >
        {children}
      </div>
    );
  }
);
Circle.displayName = "Circle";

export function Education({ education }: EducationProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoverInfo, setHoverInfo] = useState({
    isHovered: false,
    data: { title: "", institution: "", timeline: "", result: "" },
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const divRefs = education.map(() => useRef<HTMLDivElement>(null)); // Array of refs for each Circle

  const handleMouseEnter = (data, ref) => {
    const rect = ref.current.getBoundingClientRect();
    setHoverInfo({
      isHovered: true,
      data,
      position: { x: rect.left + rect.width / 2, y: rect.top - 90 },
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo({
      isHovered: false,
      data: { title: "", institution: "", timeline: "", result: "" },
      position: { x: 0, y: 0 },
    });
  };

  return (
    <section className="lg:py-16 py-6 bg-background" id="education">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="lg:text-2xl text-xl font-bold tracking-tighter">Education</h2>
          </div>
          <p className="text-muted-foreground max-w-[600px] lg:text-base text-sm text-center">
            Academic background and qualifications
          </p>
        </div>
        <div className="space-y-6">
          <div
            className={cn(
              "relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl"
            )}
            ref={containerRef}
          >
            <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-lg">
              <div className="flex flex-col justify-center gap-2">
                {hoverInfo.isHovered && (
                  <div
                    className="p-4 bg-white z-50 text-slate-900 absolute shadow-lg rounded-md"
                    style={{
                      left: `${hoverInfo.position.x}px`,
                      top: `${hoverInfo.position.y}px`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <h3 className="font-bold">{hoverInfo.data.title}</h3>
                    <p>{hoverInfo.data.institution}</p>
                    <p>{hoverInfo.data.timeline}</p>
                    <p>{hoverInfo.data.result}</p>
                  </div>
                )}
                {education.map((edu, index) => (
                  <div
                    key={edu._id}
                    onMouseEnter={() => handleMouseEnter(edu, divRefs[index])}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Circle ref={divRefs[index]} className="hover:grayscale relative">
                      <img src={edu.imgSrc} alt={edu.title} className="" />
                    </Circle>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <Circle ref={divRefs[education.length]} className="size-16">
                  <Avatar className="relative z-10 w-12 h-12">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/117724125" alt="Nay Naing Oo" />
                    <AvatarFallback>NNO</AvatarFallback>
                  </Avatar>
                </Circle>
              </div>
            </div>

            {/* Render AnimatedBeam components as needed */}
            {divRefs.slice(0, education.length).map((ref, index) => (
              <AnimatedBeam key={index} containerRef={containerRef} fromRef={ref} toRef={divRefs[education.length]} />
            ))}

            <DotPattern
              cx={1}
              cy={1}
              cr={1}
              className={cn(
                `[mask-image:radial-gradient(${isMobile ? '300' : '600'}px_circle_at_center,white,transparent)] opacity-60`
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
