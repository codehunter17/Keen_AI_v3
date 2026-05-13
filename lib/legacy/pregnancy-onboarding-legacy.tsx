"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { submitOnboarding } from "@/lib/actions/onboarding";
import { useRouter } from "next/navigation";

import { CustomSelect } from "@/components/ui/custom-select";
import { Loader } from "@/components/ui/loader";

// Form steps
const STEPS = [
  "Welcome",
  "Measurements",
  "Preferences",
  "Lifestyle",
  "Environment",
  "Supplements",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Form State
  const [formData, setFormData] = useState({
    pregnancyStage: "PREGNANT",
    pregnancyWeek: 1,
    dueDate: "",
    age: 25,
    height: 160,
    weight: 60,
    dietaryPref: "VEGETARIAN",
    regionalPref: "INDIAN",
    previousPregnancies: 0,
    supplements: "None",
    friedFoods: "Rarely",
    sugaryFoods: "Sometimes",
    waterIntake: 2.0,
    useFortifiedFood: "No",
    supplementFrequency: "Daily",
    avoidingFoods: "None",
    smokeAlcohol: "No",
    physicalActivity: "Moderate",
    cleanWater: "Yes",
    foodAccessDifficulty: "No",
    // For DailyLog fallback
    meals: { breakfast: "", lunch: "", dinner: "" },
    symptoms: "None",
    mood: "😐",
  });

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitOnboarding(formData);
      router.push("/dashboard");
    } catch {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      <div className="w-full max-w-xl">
        {/* Step Indicator */}
        <div className="mb-8 flex justify-between">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? "bg-primary" : "bg-primary/20"} transition-all duration-300`}
            />
          ))}
        </div>

        <div className="relative bg-card/60 p-8 pt-10 pb-24 rounded-3xl shadow-xl backdrop-blur-xl border border-white/20 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-heading text-primary">
                    Your Journey Begins
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Current Stage
                      </label>
                      <CustomSelect
                        value={formData.pregnancyStage}
                        onChange={(val) =>
                          setFormData({ ...formData, pregnancyStage: val })
                        }
                        options={[
                          { value: "PRE_PREGNANT", label: "Trying to conceive" },
                          { value: "PREGNANT", label: "Currently Pregnant" },
                          { value: "POST_PARTUM", label: "Post-partum" },
                        ]}
                      />
                    </div>

                    {formData.pregnancyStage === "PREGNANT" && (
                      <div>
                        <label className="block text-sm mb-2 font-medium">
                          Weeks Along (1-42)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="42"
                          className="w-full p-4 rounded-xl border border-input bg-card/50"
                          value={formData.pregnancyWeek}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pregnancyWeek: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-heading text-primary">
                    Basic Stats
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Age
                      </label>
                      <input
                        type="number"
                        className="w-full p-4 rounded-xl border border-input bg-card/50"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            age: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Previous Pregnancies
                      </label>
                      <input
                        type="number"
                        className="w-full p-4 rounded-xl border border-input bg-card/50"
                        value={formData.previousPregnancies}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            previousPregnancies: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        className="w-full p-4 rounded-xl border border-input bg-card/50"
                        value={formData.height}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            height: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        className="w-full p-4 rounded-xl border border-input bg-card/50"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weight: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-heading text-primary">
                    Preferences
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Dietary Preference
                      </label>
                      <CustomSelect
                        value={formData.dietaryPref}
                        onChange={(val) =>
                          setFormData({ ...formData, dietaryPref: val })
                        }
                        options={[
                          { value: "VEGETARIAN", label: "Vegetarian" },
                          { value: "VEGAN", label: "Vegan" },
                          { value: "NON_VEG", label: "Non-Vegetarian" },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Regional Preference
                      </label>
                      <CustomSelect
                        value={formData.regionalPref}
                        onChange={(val) =>
                          setFormData({ ...formData, regionalPref: val })
                        }
                        options={[
                          { value: "INDIAN", label: "Indian" },
                          { value: "WESTERN", label: "Western" },
                          { value: "ASIAN", label: "Asian" },
                          { value: "MEDITERRANEAN", label: "Mediterranean" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading text-primary">
                    Lifestyle Habits
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-card/40">
                      <span className="text-sm font-medium">
                        Physical Activity
                      </span>
                      <CustomSelect
                        value={formData.physicalActivity}
                        onChange={(val) =>
                          setFormData({ ...formData, physicalActivity: val })
                        }
                        options={[
                          { value: "Low", label: "Low" },
                          { value: "Moderate", label: "Moderate" },
                          { value: "High", label: "High" },
                        ]}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-card/40">
                      <span className="text-sm font-medium">Fried Foods</span>
                      <CustomSelect
                        value={formData.friedFoods}
                        onChange={(val) =>
                          setFormData({ ...formData, friedFoods: val })
                        }
                        options={[
                          { value: "Never", label: "Never" },
                          { value: "Rarely", label: "Rarely" },
                          { value: "Sometimes", label: "Sometimes" },
                          { value: "Often", label: "Often" },
                        ]}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-card/40">
                      <span className="text-sm font-medium">Sugary Foods</span>
                      <CustomSelect
                        value={formData.sugaryFoods}
                        onChange={(val) =>
                          setFormData({ ...formData, sugaryFoods: val })
                        }
                        options={[
                          { value: "Never", label: "Never" },
                          { value: "Rarely", label: "Rarely" },
                          { value: "Sometimes", label: "Sometimes" },
                          { value: "Often", label: "Often" },
                        ]}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-card/40">
                      <span className="text-sm font-medium">
                        Smoke/Alcohol?
                      </span>
                      <CustomSelect
                        value={formData.smokeAlcohol}
                        onChange={(val) =>
                          setFormData({ ...formData, smokeAlcohol: val })
                        }
                        options={[
                          { value: "No", label: "No" },
                          { value: "Yes", label: "Yes" },
                        ]}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-heading text-primary">
                    Environment
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card/40">
                      <span className="font-medium">Clean Water Access?</span>
                      <CustomSelect
                        value={formData.cleanWater}
                        onChange={(val) =>
                          setFormData({ ...formData, cleanWater: val })
                        }
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card/40">
                      <span className="font-medium">
                        Food Access Difficulty?
                      </span>
                      <CustomSelect
                        value={formData.foodAccessDifficulty}
                        onChange={(val) =>
                          setFormData({ ...formData, foodAccessDifficulty: val })
                        }
                        options={[
                          { value: "No", label: "No" },
                          { value: "Yes", label: "Yes" },
                        ]}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-heading text-primary">
                    Supplements
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Main Supplements
                      </label>
                      <input
                        type="text"
                        placeholder="Folic Acid, Iron, etc."
                        className="w-full p-4 rounded-xl border border-input bg-card/50"
                        value={formData.supplements}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            supplements: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card/40">
                      <span className="font-medium">Use Fortified Food?</span>
                      <CustomSelect
                        value={formData.useFortifiedFood}
                        onChange={(val) =>
                          setFormData({ ...formData, useFortifiedFood: val })
                        }
                        options={[
                          { value: "No", label: "No" },
                          { value: "Yes", label: "Yes" },
                        ]}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between absolute bottom-8 left-8 right-8">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border-2 border-primary/20 text-primary font-medium hover:bg-secondary/50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 shadow-md transition-all active:scale-95"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Finishing..." : "Complete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
