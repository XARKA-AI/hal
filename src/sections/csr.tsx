import { Heart, TreePine, Users, BookOpen } from "lucide-react"

const initiatives = [
  {
    icon: Heart,
    title: "Community Welfare",
    description: "Supporting local communities through healthcare and social welfare programs.",
  },
  {
    icon: TreePine,
    title: "Environmental Responsibility",
    description: "Committed to sustainable practices and minimizing environmental impact.",
  },
  {
    icon: Users,
    title: "Employee Wellbeing",
    description: "Fostering a safe and inclusive workplace for all employees.",
  },
  {
    icon: BookOpen,
    title: "Education Support",
    description: "Promoting education and skill development in underprivileged communities.",
  },
]

export function CSR() {
  return (
    <section id="csr" className="py-14 md:py-20 border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Corporate Social Responsibility
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            CSR
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            HAL Offshore is committed to making a positive impact on society and the environment 
            through our corporate social responsibility initiatives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initiatives.map((initiative) => (
            <div
              key={initiative.title}
              className="group p-6 bg-background border border-border rounded-lg hover:border-foreground/20 transition-colors duration-150"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg mb-4">
                <initiative.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-foreground mb-2">
                {initiative.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {initiative.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
