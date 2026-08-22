import { Briefcase, GraduationCap, Award, ArrowRight } from "lucide-react"

const benefits = [
  {
    icon: Briefcase,
    title: "Growth Opportunities",
    description: "Clear career progression paths and professional development programs.",
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    description: "Continuous learning opportunities and skill enhancement programs.",
  },
  {
    icon: Award,
    title: "Competitive Benefits",
    description: "Attractive compensation packages and comprehensive benefits.",
  },
]

export function Career() {
  return (
    <section id="career" className="py-14 md:py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Join Our Team
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-5">
              Career
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              HAL Offshore is always looking for talented professionals to join our growing team. 
              We offer challenging opportunities in the offshore oil and gas industry with a focus 
              on safety, innovation, and excellence.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you are an experienced professional or a fresh graduate, we provide a 
              dynamic work environment that fosters growth and development.
            </p>
            <a
              href="mailto:careers@haloffshore.in"
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors duration-150"
            >
              View Openings
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 p-4 border border-border rounded-lg"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
