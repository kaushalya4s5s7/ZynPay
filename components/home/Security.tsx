import { Shield, Lock, Eye, Award } from 'lucide-react';

export default function Security() {
  const securityFeatures = [
    {
      icon: <Shield size={32} />,
      title: "SOC 2 Type II Certified",
      description: "Independently audited security controls that meet the highest industry standards for data protection.",
      badge: "Certified"
    },
    {
      icon: <Lock size={32} />,
      title: "End-to-End Encryption",
      description: "All data encrypted in transit and at rest using AES-256 encryption. Your payroll data is always secure.",
      badge: "AES-256"
    },
    {
      icon: <Eye size={32} />,
      title: "GDPR Compliant",
      description: "Full compliance with European data protection regulations. Your employees' privacy is our priority.",
      badge: "EU Approved"
    },
    {
      icon: <Award size={32} />,
      title: "Bank-Level Security",
      description: "Multi-factor authentication, role-based access, and continuous monitoring protect your financial data.",
      badge: "Enterprise Grade"
    }
  ];

  const complianceLogos = [
    { name: "SOC 2", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=150&q=80" },
    { name: "GDPR", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=150&q=80" },
    { name: "PCI DSS", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=150&q=80" },
    { name: "ISO 27001", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=150&q=80" }
  ];

  return (
    <section id="security" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Enterprise-Grade Security & Compliance
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your payroll data deserves the highest level of protection. We use bank-grade security 
            and maintain strict compliance standards to keep your information safe.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                {/* Icon */}
                <div className="text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                
                {/* Badge */}
                <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-medium text-white mb-4">
                  {feature.badge}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Certifications */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Compliance Certifications</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We maintain the highest industry standards and regularly undergo third-party audits 
              to ensure your data is protected.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {complianceLogos.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-sm">{cert.name}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-300 font-medium">{cert.name} Certified</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">99.9%</div>
            <div className="text-gray-300">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">256-bit</div>
            <div className="text-gray-300">Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-gray-300">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">0</div>
            <div className="text-gray-300">Data Breaches</div>
          </div>
        </div>

        {/* Security Features List */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-center mb-8">Additional Security Features</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Two-Factor Authentication</h4>
                  <p className="text-gray-300 text-sm">Required for all admin accounts</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Role-Based Access Control</h4>
                  <p className="text-gray-300 text-sm">Granular permissions for team members</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Audit Logging</h4>
                  <p className="text-gray-300 text-sm">Complete activity tracking and reporting</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Regular Penetration Testing</h4>
                  <p className="text-gray-300 text-sm">Monthly security assessments by third parties</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Data Backup & Recovery</h4>
                  <p className="text-gray-300 text-sm">Automated daily backups with instant recovery</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Geographic Data Residency</h4>
                  <p className="text-gray-300 text-sm">Data stored in your preferred region</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Incident Response Team</h4>
                  <p className="text-gray-300 text-sm">24/7 security monitoring and response</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold mb-1">Regular Security Training</h4>
                  <p className="text-gray-300 text-sm">All employees undergo security certification</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold mb-4">Questions About Security?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our security team is happy to discuss our measures and provide additional documentation.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Security Team
          </button>
        </div>
      </div>
    </section>
  );
}
