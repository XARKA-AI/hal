import { Shield, FileText, Lock, Eye } from "lucide-react"

const policies = [
  {
    icon: Shield,
    title: "QHSE Policy",
    description: "Quality, Health, Safety, and Environment policy ensuring zero-incident operations.",
  },
  {
    icon: FileText,
    title: "Code of Conduct",
    description: "Ethical guidelines and professional standards for all employees.",
  },
  {
    icon: Lock,
    title: "Data Privacy Policy",
    description: "Protection of personal and corporate data in compliance with regulations.",
  },
  {
    icon: Eye,
    title: "Whistleblower Policy",
    description: "Mechanism for reporting concerns without fear of retaliation.",
  },
]

export function Policy() {
  return (
    <section id="policy" className="py-14 md:py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Governance
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Policy
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            HAL Offshore adheres to strict policies and guidelines to ensure ethical business 
            practices and regulatory compliance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <div
              key={policy.title}
              className="group p-6 border border-border rounded-lg hover:border-foreground/20 transition-colors duration-150"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg flex-shrink-0">
                  <policy.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
