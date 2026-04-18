import { motion } from "framer-motion";
import { Award, HeartPulse, Microscope, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-slate-900/50" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 dark:text-white">
              About <span className="text-primary">Sanjivani</span> Clinical Laboratory
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              We are committed to delivering highly accurate diagnostic services with state-of-the-art technology, unparalleled expertise, and a patient-first approach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats/Image Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern Laboratory"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl z-[-1]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold font-heading mb-4 text-slate-900 dark:text-white">
                  A Legacy of Trust and Precision
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  Since our inception, Sanjivani Clinical Laboratory has been at the forefront of healthcare diagnostics. We believe that an accurate diagnosis is the first and most crucial step towards effective medical treatment. Our laboratories are fully automated and equipped with the latest advancements in pathology to ensure no compromise on quality.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 border-0 shadow-lg bg-blue-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <HeartPulse className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">1M+</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tests Conducted</p>
                </Card>
                <Card className="p-6 border-0 shadow-lg bg-green-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <Users className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">10k+</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Happy Patients</p>
                </Card>
                <Card className="p-6 border-0 shadow-lg bg-purple-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <Award className="h-10 w-10 text-purple-600 mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">ISO</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">9001 Certified</p>
                </Card>
                <Card className="p-6 border-0 shadow-lg bg-amber-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <Microscope className="h-10 w-10 text-amber-600 mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Support & Care</p>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision/Mission */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Guided by compassion and precision, we aim to bridge the gap between people and accessible healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm hover:scale-110 transition-transform">
                <Microscope className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Precision</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Utilizing cutting-edge technologies and automated workflows to deliver zero-defect diagnostic reports you can count on.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600 shadow-sm hover:scale-110 transition-transform">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Compassion</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Treating every sample as a human life. We ensure a comfortable, hygienic, and pain-free experience for everyone.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 shadow-sm hover:scale-110 transition-transform">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Accessibility</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Making advanced health diagnostics affordable and accessible to the entire community without compromising on excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
