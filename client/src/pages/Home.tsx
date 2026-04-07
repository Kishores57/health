import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Activity, Clock, ShieldCheck, Microscope, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTests } from "@/hooks/use-lab";

export default function Home() {
  const { data: tests, isLoading } = useTests();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-20 pb-32 lg:pt-32 lg:pb-40 hero-gradient">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              className="lg:w-1/2 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Trusted by 10,000+ Patients
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 leading-[1.1]">
                Advanced Diagnostics, <br />
                <span className="text-primary">Compassionate Care</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Experience fast, accurate, and reliable blood testing services from the comfort of your home or at our state-of-the-art laboratory centers.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/book">
                  <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Book a Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm hover:bg-white">
                    View Services
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">24h</h3>
                  <p className="text-sm text-slate-500">Fast Reports</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">100+</h3>
                  <p className="text-sm text-slate-500">Expert Doctors</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">50k+</h3>
                  <p className="text-sm text-slate-500">Happy Patients</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                {/* laboratory scientist looking into microscope */}
                <img
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000"
                  alt="Laboratory Scientist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl inline-flex items-center gap-4 shadow-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Certification</p>
                      <p className="text-sm font-bold text-slate-900">ISO 9001 Certified Lab</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services/Tests Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">Our Popular Tests</h2>
            <p className="text-slate-600">
              We offer a comprehensive range of diagnostic tests. Choose from individual tests or complete health packages.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tests?.slice(0, 3).map((test) => (
                <Card key={test.id} className="group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden flex flex-col">
                  <div className="h-2 bg-gradient-to-r from-primary to-blue-400" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <Microscope className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-bold text-lg text-primary">₹{(test.price / 100).toFixed(2)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {test.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                      {test.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {test.turnaroundTime}
                      </span>
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">
                        {test.sampleType}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/book">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                View All Tests
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Booking</h3>
              <p className="text-slate-600">
                Book your appointment online in just a few clicks. Choose your preferred time and location.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accurate Results</h3>
              <p className="text-slate-600">
                Our fully automated labs ensure 100% accuracy in your test reports with double verification.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Reports</h3>
              <p className="text-slate-600">
                Access your medical history and reports securely online anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
            Prioritize Your Health Today
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Don't wait for symptoms. Regular checkups can help detect issues early.
            Book a test now and take the first step towards a healthier life.
          </p>
          <Link href="/book">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold shadow-xl">
              Book Appointment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
