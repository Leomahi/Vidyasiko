import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users } from "lucide-react";

export default function RoleChooser() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">VidyaQuest</h1>
          <p className="text-muted-foreground mt-1">Who are you?</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/student/auth"
            className="group bg-card border border-border rounded-3xl p-8 text-center hover:shadow-lg hover:border-primary transition-all"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-1">I'm a Student</h2>
            <p className="text-sm text-muted-foreground">
              Play games, earn XP, and learn STEM subjects.
            </p>
          </Link>

          <Link
            to="/teacher/auth"
            className="group bg-card border border-border rounded-3xl p-8 text-center hover:shadow-lg hover:border-accent transition-all"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-1">I'm a Teacher</h2>
            <p className="text-sm text-muted-foreground">
              Monitor your students' progress and engagement.
            </p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
