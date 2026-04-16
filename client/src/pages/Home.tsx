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
      <section className="relative overflow-hidden bg-background pt-20 pb-32 lg:pt-32 lg:pb-40 hero-gradient">
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
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.3 }}
                    className="relative inline-block"
                  >
                    {/* Pulsing glow ring behind the button */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-primary"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0, 0.35] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Second outer ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-blue-400"
                      animate={{ scale: [1, 1.28, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    />

                    <motion.button
                      onClick={() => { window.location.href = "/book"; }}
                      className="relative h-16 px-12 text-xl font-bold rounded-2xl text-white overflow-hidden flex items-center gap-3 z-10"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #3b82f6 60%, #06b6d4 100%)",
                        boxShadow: "0 8px 32px -4px rgba(59,130,246,0.5), 0 2px 8px rgba(0,0,0,0.12)",
                      }}
                      whileHover={{
                        scale: 1.08,
                        y: -4,
                        boxShadow: "0 20px 50px -8px rgba(59,130,246,0.65), 0 4px 16px rgba(0,0,0,0.15)",
                        transition: { type: "spring", stiffness: 300, damping: 16 },
                      }}
                      whileTap={{ scale: 0.95, y: 0 }}
                    >
                      {/* Shimmer sweep */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        initial={{ x: "-120%" }}
                        animate={{ x: "220%" }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                      />

                      <span className="relative z-10">Book a Test</span>

                      {/* Arrow that shoots right on hover */}
                      <motion.div
                        className="relative z-10"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-6 w-6" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
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
      <section className="py-20 bg-background">
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
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{ show: { transition: { staggerChildren: 0.18 } } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {tests?.slice(0, 3).map((test, i) => (
                <motion.div
                  key={test.id}
                  variants={{
                    hidden: { opacity: 0, y: 60, scale: 0.88, rotate: -3 },
                    show:   { opacity: 1, y: 0,  scale: 1,    rotate: 0,
                              transition: { type: "spring", stiffness: 120, damping: 14 } },
                  }}
                  whileHover={{
                    y: -18,
                    scale: 1.06,
                    rotate: i % 2 === 0 ? 1.5 : -1.5,
                    boxShadow: "0 32px 60px -12px rgba(59,130,246,0.35)",
                    transition: { type: "spring", stiffness: 260, damping: 16 },
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer"
                >
                  <Card className="group border-slate-100 dark:border-slate-700/60 overflow-hidden flex flex-col h-full [background:linear-gradient(135deg,#fff_80%,#eff6ff_100%)] dark:[background:linear-gradient(135deg,hsl(224_25%_13%)_80%,hsl(220_30%_15%)_100%)]">
                    {/* Animated accent bar */}
                    <motion.div
                      className="h-2 bg-gradient-to-r from-primary via-blue-400 to-cyan-400"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1, transition: { duration: 0.6, delay: i * 0.18 + 0.3 } }}
                      viewport={{ once: true }}
                    />
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <motion.div
                          className="p-3 bg-blue-50 rounded-xl"
                          whileHover={{ rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 0.5 } }}
                        >
                          <Microscope className="h-6 w-6 text-primary" />
                        </motion.div>
                        <motion.span
                          className="font-bold text-lg text-primary"
                          whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 300 } }}
                        >
                          ₹{(test.price / 100).toFixed(2)}
                        </motion.span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-200">
                        {test.name}
                      </h3>
                      <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                        {test.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {test.turnaroundTime}
                        </span>
                        <span className="bg-blue-50 px-2 py-1 rounded-lg text-primary font-medium">
                          {test.sampleType}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
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
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Booking</h3>
              <p className="text-slate-600">
                Book your appointment online in just a few clicks. Choose your preferred time and location.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accurate Results</h3>
              <p className="text-slate-600">
                Our fully automated labs ensure 100% accuracy in your test reports with double verification.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border">
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
