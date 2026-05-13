"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/actions/dashboard";
import { updateProfile, deleteAccount } from "@/lib/actions/profile";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Settings,
  Coffee,
  Globe,
  LogOut,
  CheckCircle2,
  Bell,
  AlertTriangle,
  Trash2,
  Zap,
  CreditCard,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/ui/custom-select";
import { TIER_LIMITS, Tier } from "@/lib/tiers";
import { HeightInput } from "@/components/height-input";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => await getDashboardData(),
    enabled: !!session?.user?.id,
    staleTime: 60000, // Cache for 1 minute
  });

  const [formData, setFormData] = useState({
    name: "",
    dietaryPref: "None",
    regionalPref: "None",
    age: "",
    height: "",
    weight: "",
    previousPregnancies: "",
    supplements: "",
    friedFoods: "Rarely",
    sugaryFoods: "Sometimes",
    waterIntake: "2.0",
    useFortifiedFood: "No",
    supplementFrequency: "Daily",
    avoidingFoods: "",
    symptoms: "",
    smokeAlcohol: "No",
    physicalActivity: "Moderate",
    sleepDuration: "8",
    movementDuration: "30",
    mood: "Refreshed",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data?.user) {
      queueMicrotask(() => {
        setFormData({
          name: data?.user?.name || "",
          dietaryPref: data?.user?.dietaryPref || "None",
          regionalPref: data?.user?.regionalPref || "None",
          age: data?.user?.age?.toString() || "",
          height: data?.user?.height?.toString() || "",
          weight: data?.user?.weight?.toString() || "",
          previousPregnancies: data?.user?.previousPregnancies?.toString() || "0",
          supplements: data?.user?.supplements || "",
          friedFoods: data?.user?.friedFoods || "Rarely",
          sugaryFoods: data?.user?.sugaryFoods || "Sometimes",
          waterIntake: data?.user?.waterIntake?.toString() || "2.0",
          useFortifiedFood: data?.user?.useFortifiedFood || "No",
          supplementFrequency: data?.user?.supplementFrequency || "Daily",
          avoidingFoods: data?.user?.avoidingFoods || "",
          symptoms: data?.user?.symptoms || "",
          smokeAlcohol: data?.user?.smokeAlcohol || "No",
          physicalActivity: data?.user?.physicalActivity || "Moderate",
          sleepDuration: data?.user?.sleepDuration?.toString() || "8",
          movementDuration: data?.user?.movementDuration?.toString() || "30",
          mood: data?.user?.mood || "Refreshed",
        });
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (vars: typeof formData) => await updateProfile(vars),
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await authClient.signOut();
      router.push("/");
    } catch {
      setIsDeleting(false);
    }
    setShowDeleteConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const userName = data?.user?.name || "Mom-to-be";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground">
            Account Settings
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Manage your maternal health profile and preferences
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-400/10  text-red-500 hover:bg-red-50 w-fit transition-all active:scale-95 text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Summary Column (Right on Desktop, Top on Mobile) */}
        <div className="space-y-6 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-linear-to-br from-primary/60 to-secondary/60 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 text-primary bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl border border-white/30 truncate">
                {formData.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-2xl text-primary font-bold">{userName}</h3>
                <div className="mt-2 inline-block px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full border border-white/20">
                  <p className="text-xs font-semibold uppercase  text-white">
                    {data?.user?.tier || "FREE"} MEMBER
                  </p>
                </div>
                <p className="opacity-80 font-medium mt-3">
                  {data?.user?.pregnancyStage === "PREGNANT"
                    ? `${data?.user?.pregnancyWeek} Weeks Along`
                    : "Welcome to NutriMama"}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">Joined</span>
                <span className="font-bold">
                  {data?.user?.createdAt
                    ? new Date(data.user.createdAt).toLocaleDateString()
                    : "..."}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">Reports Analyzed</span>
                <span className="font-bold">
                  {data?.reportsAnalyzedCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">AI Chats</span>
                <span className="font-bold">{data?.chatsCount || 0}</span>
              </div>
            </div>
          </motion.div>

          <div className="bg-card p-6 rounded-4xl border border-border shadow-sm">
            <div className="flex items-center space-x-3 text-primary mb-4">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Weekly Summary Ready
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Your week 12 nutrition report is available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Column (Left on Desktop, Bottom on Mobile) */}
        <div className="lg:col-span-2 space-y-6 lg:order-1">
          {/* Personal Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Personal Info
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>
                <div className="space-y-2 opacity-60">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="w-full p-4 rounded-2xl border border-border bg-muted cursor-not-allowed font-medium">
                    {data?.user?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                  <Coffee className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Pregnancy Diet
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Dietary Preference
                  </label>
                  <CustomSelect
                    value={formData.dietaryPref}
                    onChange={(val) =>
                      setFormData({ ...formData, dietaryPref: val })
                    }
                    options={[
                      { value: "None", label: "None / Standard" },
                      { value: "VEGETARIAN", label: "Vegetarian" },
                      { value: "VEGAN", label: "Vegan" },
                      { value: "NON_VEG", label: "Non-Vegetarian" },
                    ]}
                    icon={<Coffee className="w-5 h-5" />}
                    disabled={true}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Regional Food Preference
                  </label>
                  <CustomSelect
                    value={formData.regionalPref}
                    onChange={(val) =>
                      setFormData({ ...formData, regionalPref: val })
                    }
                    options={[
                      { value: "None", label: "None / Global" },
                      { value: "INDIAN", label: "Indian" },
                      { value: "WESTERN", label: "Western" },
                      { value: "ASIAN", label: "Asian" },
                    ]}
                    icon={<Globe className="w-5 h-5" />}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Health Assessment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-600">
                  <Settings className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Health Assessment
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="e.g. 28"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="e.g. 65"
                  />
                </div>
                <div className="space-y-2">
                  <HeightInput
                    valueCm={formData.height ? parseFloat(formData.height) : undefined}
                    onChange={(cm) =>
                      setFormData({ ...formData, height: cm == null ? "" : String(cm) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Smoking/Alcohol Habits
                  </label>
                  <CustomSelect
                    value={formData.smokeAlcohol}
                    onChange={(val) =>
                      setFormData({ ...formData, smokeAlcohol: val })
                    }
                    options={[
                      { value: "No", label: "No (Neither)" },
                      { value: "Occasionally", label: "Occasionally" },
                      { value: "Yes", label: "Yes (Regularly)" },
                      { value: "Quit recently", label: "Quit recently" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Physical Activity
                  </label>
                  <CustomSelect
                    value={formData.physicalActivity}
                    onChange={(val) =>
                      setFormData({ ...formData, physicalActivity: val })
                    }
                    options={[
                      {
                        value: "Sedentary",
                        label: "Sedentary (Little/no exercise)",
                      },
                      { value: "Moderate", label: "Moderate (Active daily)" },
                      {
                        value: "Very Active",
                        label: "Very Active (Heavy exercise)",
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Current Symptoms
                </label>
                <input
                  type="text"
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="e.g. Fatigue, Nausea, Back pain"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Fried Food Intake
                  </label>
                  <CustomSelect
                    value={formData.friedFoods}
                    onChange={(val) =>
                      setFormData({ ...formData, friedFoods: val })
                    }
                    options={[
                      { value: "Rarely", label: "Rarely / Never" },
                      { value: "Sometimes", label: "Sometimes (Weekly)" },
                      { value: "Often", label: "Often (Daily)" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Water Intake (Liters)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.waterIntake}
                    onChange={(e) =>
                      setFormData({ ...formData, waterIntake: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Restful Sleep (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.sleepDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sleepDuration: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl border border-border bg-background outline-none transition-all font-medium appearance-none"
                    placeholder="e.g. 7.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Movement (Minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.movementDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        movementDuration: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl border border-border bg-background outline-none transition-all font-medium appearance-none"
                    placeholder="e.g. 45"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Emotional Balance
                  </label>
                  <CustomSelect
                    value={formData.mood}
                    onChange={(val) => setFormData({ ...formData, mood: val })}
                    options={[
                      { value: "Refreshed", label: "Refreshed" },
                      { value: "Steady", label: "Steady" },
                      { value: "Tired", label: "Tired" },
                      { value: "Anxious", label: "Anxious" },
                      { value: "Joyful", label: "Joyful" },
                    ]}
                  />
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => mutation.mutate(formData)}
                  disabled={mutation.isPending}
                  className="w-full bg-primary text-white py-5 rounded-3xl font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                >
                  <span>
                    {mutation.isPending
                      ? "Updating Profile..."
                      : "Save Changes"}
                  </span>
                </button>

                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center justify-center space-x-2 text-secondary font-bold mt-4"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Profile successfully updated!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Subscription Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6"
          >
            <div className="flex items-start gap-2 md:items-center justify-between md:flex-row flex-col ">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Subscription Plan
                </h2>
              </div>
              <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
                {data?.user?.tier || "FREE"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-muted/30 border border-border">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  Report Analyses
                </p>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-foreground">
                    {data?.reportsAnalyzedCount || 0}
                    <span className="text-sm text-muted-foreground font-medium ml-1">
                      /{" "}
                      {TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                        .reportAnalysesPerMonth === Infinity
                        ? "∞"
                        : TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                            .reportAnalysesPerMonth}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-primary">
                    {Math.round(
                      ((data?.reportsAnalyzedCount || 0) /
                        (TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                          .reportAnalysesPerMonth || 1)) *
                        100,
                    )}
                    %
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.min(
                        ((data?.reportsAnalyzedCount || 0) /
                          (TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                            .reportAnalysesPerMonth || 1)) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-muted/30 border border-border">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  AI Chats
                </p>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-foreground">
                    {data?.chatsCount || 0}
                    <span className="text-sm text-muted-foreground font-medium ml-1">
                      /{" "}
                      {TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                        .aiChatsPerDay === Infinity
                        ? "∞"
                        : TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                            .aiChatsPerDay}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-secondary">
                    {Math.round(
                      ((data?.chatsCount || 0) /
                        (TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                          .aiChatsPerDay || 1)) *
                        100,
                    )}
                    %
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-secondary"
                    style={{
                      width: `${Math.min(
                        ((data?.chatsCount || 0) /
                          (TIER_LIMITS[(data?.user?.tier as Tier) || "FREE"]
                            .aiChatsPerDay || 1)) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-all flex items-center justify-center space-x-2 group">
              <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Upgrade to Pro Max</span>
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/5 p-8 rounded-[2.5rem] border border-red-500/20 shadow-sm space-y-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-red-600">
                  Danger Zone
                </h2>
                <p className="text-sm text-red-500 font-medium opacity-80">
                  Irreversible actions for your account
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white dark:bg-background rounded-3xl border border-red-500/10">
              <div>
                <h3 className="font-bold text-foreground">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently remove your profile and all maternal data.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 text-sm flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Forever</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-heading font-bold text-foreground">
                  Are you absolutely sure?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  This action is permanent. All your nutrition plans, reports,
                  and health insights will be erased forever.
                </p>
              </div>
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Confirm Deletion</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-muted text-muted-foreground py-4 rounded-2xl font-bold hover:bg-muted/80 transition-all active:scale-95"
                >
                  No, Keep My Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
