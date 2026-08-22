import { Shield, Award, Users, Clock, Target, Zap } from "lucide-react"

const strengths = [
  {
    icon: Shield,
    title: "Safety Excellence",
    description: "Zero-incident safety record with comprehensive QHSE policies and procedures.",
  },
  {
    icon: Award,
    title: "Certified Operations",
    description: "Certified by ABS, DNV, and Lloyd's Register for all offshore operations.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Highly skilled workforce with decades of offshore industry experience.",
  },
  {
    icon: Clock,
    title: "24/7 Operations",
    description: "Round-the-clock project support and emergency response capabilities.",
  },
  {
    icon: Target,
    title: "Project Delivery",
    description: "Proven track record of delivering complex projects on time and within budget.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Continuous adoption of new technologies and innovative solutions.",
  },
]

export function Strength() {
  return (
    <section id="strength" className="py-14 md:py-20 border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            My Strength
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            HAL Offshore's core competencies that drive our success in the offshore industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strengths.map((strength) => (
            <div
              key={strength.title}
              className="group p-6 bg-background border border-border rounded-lg hover:border-foreground/20 transition-colors duration-150"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg mb-4">
                <strength.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-foreground mb-2">
                {strength.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {strength.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
