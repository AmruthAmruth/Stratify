import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import PlanCard from "../common/PlanCard";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";

import { addPlanSchema } from "@/shared/utils/validations";
import { planFormFields } from "@/shared/components/Forms/formFields";
import {
  listSubscriptionPlan,
} from "@/services/company";
import { createSubscription, updateSubscription, deleteSubscription } from "@/services/plans";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";

interface Plan {
  plan: string;
  description: string;
  amount: number;
  durationInMonths: number;
}

const ManagePlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    plan?: Plan;
    message?: string;
  }>({ isOpen: false });

  const { enqueueSnackbar } = useSnackbar();

  // 🔹 Fetch Plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await listSubscriptionPlan();
        setPlans(data);
      } catch {
        enqueueSnackbar("Failed to load subscription plans.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // 🔹 Add / Edit Plan Submit Handler
  const handleSubmit = async (values: Plan) => {
    try {
      setSubmitLoading(true);

      if (editingPlan) {
        await updateSubscription(values);
        setPlans(plans.map((p) => (p.plan === editingPlan.plan ? values : p)));
        enqueueSnackbar("Plan updated successfully!", { variant: "success" });
      } else {
        await createSubscription(values);
        setPlans([...plans, values]);
        enqueueSnackbar("Plan added successfully!", { variant: "success" });
      }

      setIsModalOpen(false);
      setEditingPlan(null);
    } catch (err: any) {
      enqueueSnackbar(err.message || "Something went wrong.", { variant: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  // 🔹 Open Add Plan Modal
  const handleAddClick = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  // 🔹 Open Edit Plan Modal
  const handleEdit = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setIsModalOpen(true);
  };

  // 🔹 Trigger Confirm Delete Dialog
  const handleDelete = (plan: Plan) => {
    setConfirmDialog({
      isOpen: true,
      plan,
      message: `Are you sure you want to delete the plan "${plan.plan}"?`,
    });
  };

  // 🔹 Confirm Delete
  const confirmDelete = async () => {
    if (!confirmDialog.plan) return;

    try {
      await deleteSubscription(confirmDialog.plan.plan);
      setPlans(plans.filter((p) => p.plan !== confirmDialog.plan!.plan));
      enqueueSnackbar("Plan deleted successfully!", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to delete plan.", { variant: "error" });
    } finally {
      setConfirmDialog({ isOpen: false });
    }
  };

  // 🔹 Cancel Delete
  const cancelDelete = () => setConfirmDialog({ isOpen: false });

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading plans...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Manage Subscription Plans</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white py-2 px-5 rounded-xl hover:bg-blue-700 font-semibold transition"
        >
          + Add New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.plan}
            plan={plan}
            mode="super-admin"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? "Edit Plan" : "Add Plan"}
      >
        <AuthForm
          fields={planFormFields}
          validationSchema={addPlanSchema}
          onSubmit={handleSubmit}
          initialValues={
            editingPlan ?? {
              plan: "",
              description: "",
              amount: 0,
              durationInMonths: 1,
            }
          }
          buttonText={submitLoading ? "Saving..." : editingPlan ? "Update Plan" : "Add Plan"}
        />
        {submitLoading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message || ""}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ManagePlans;
