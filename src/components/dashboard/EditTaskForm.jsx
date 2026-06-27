"use client";

import { useState } from "react";
import { Button, Input, Label, TextArea } from "@heroui/react";
import { FiAlertCircle } from "react-icons/fi";
import { updateTask } from "@/lib/api";

const categories = ["Design", "Writing", "Development", "Marketing", "Other"];

const normalizeTaskId = (id) => {
  if (typeof id === "string") {
    return id.trim();
  }

  if (id && typeof id === "object") {
    if (typeof id.toHexString === "function") {
      return id.toHexString();
    }

    if (typeof id.toString === "function") {
      const stringValue = id.toString();
      if (stringValue.startsWith("ObjectId(\"") && stringValue.endsWith("\")")) {
        return stringValue.slice(9, -2);
      }
      return stringValue;
    }
  }

  return String(id ?? "").trim();
};

export default function EditTaskForm({ task, onCancel, onUpdated }) {
  const taskId = normalizeTaskId(task?._id ?? task?.id ?? task?.taskId ?? "");
  const [formValues, setFormValues] = useState({
    title: task?.title || "",
    category: task?.category || "",
    description: task?.description || "",
    budget: task?.budget || "",
    deadline: task?.deadline ? String(task.deadline).slice(0, 10) : "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: "idle", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateFields = () => {
    const errors = {};

    if (!String(formValues.title || "").trim()) {
      errors.title = "Please enter a task title";
    } else if (String(formValues.title).trim().length < 5) {
      errors.title = "Title should be at least 5 characters";
    }

    if (!String(formValues.category || "").trim()) {
      errors.category = "Please choose a category";
    }

    if (!String(formValues.description || "").trim()) {
      errors.description = "Please describe what you need";
    } else if (String(formValues.description).trim().length < 20) {
      errors.description = "Description should be at least 20 characters";
    }

    const budgetValue = Number(formValues.budget || 0);
    if (!formValues.budget && formValues.budget !== 0) {
      errors.budget = "Please enter a budget";
    } else if (budgetValue <= 0) {
      errors.budget = "Budget must be greater than zero";
    }

    if (!String(formValues.deadline || "").trim()) {
      errors.deadline = "Please select a deadline";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!taskId) {
      setStatusMessage({ type: "error", text: "Unable to update the task: missing task identifier." });
      return;
    }

    if (!validateFields()) {
      setStatusMessage({ type: "error", text: "Please fix the highlighted fields before saving." });
      return;
    }

    const payload = {
      title: String(formValues.title || "").trim(),
      category: String(formValues.category || "").trim(),
      description: String(formValues.description || "").trim(),
      budget: Number(formValues.budget || 0),
      deadline: String(formValues.deadline || "").trim(),
      id: taskId,
      _id: taskId,
      taskId: taskId,
    };

    setIsSubmitting(true);
    setStatusMessage({ type: "idle", text: "" });

    try {
      const response = await updateTask(taskId, payload);
      if (response?.success && response?.data) {
        onUpdated(response.data);
      } else {
        setStatusMessage({ type: "error", text: response?.message || "Unable to save changes." });
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: error?.message || "Unable to save changes." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (error) =>
    `rounded-2xl border px-3 py-2 text-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:bg-slate-900 dark:text-slate-100 ${
      error ? "border-rose-500 ring-1 ring-rose-200 dark:border-rose-400" : "border-slate-300 dark:border-slate-700"
    }`;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Edit open task</p>
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Update your task details</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Only open tasks can be edited. Make updates to the title, description, budget, category, or deadline.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Task title</Label>
          <Input
            className={inputClass(fieldErrors.title)}
            name="title"
            placeholder="Design a landing page for my startup"
            value={formValues.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
          {fieldErrors.title ? <p className="text-sm text-rose-600 dark:text-rose-400">{fieldErrors.title}</p> : null}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <select
            name="category"
            value={formValues.category}
            onChange={(event) => updateField("category", event.target.value)}
            className={inputClass(fieldErrors.category)}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {fieldErrors.category ? <p className="text-sm text-rose-600 dark:text-rose-400">{fieldErrors.category}</p> : null}
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <TextArea
            className={inputClass(fieldErrors.description)}
            name="description"
            placeholder="Describe the task, deliverables, style, and any requirements."
            value={formValues.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
          {fieldErrors.description ? (
            <p className="text-sm text-rose-600 dark:text-rose-400">{fieldErrors.description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Budget (USD)</Label>
            <Input
              className={inputClass(fieldErrors.budget)}
              name="budget"
              min="1"
              step="1"
              placeholder="150"
              type="number"
              value={formValues.budget}
              onChange={(event) => updateField("budget", event.target.value)}
            />
            {fieldErrors.budget ? <p className="text-sm text-rose-600 dark:text-rose-400">{fieldErrors.budget}</p> : null}
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              className={inputClass(fieldErrors.deadline)}
              name="deadline"
              type="date"
              value={formValues.deadline}
              onChange={(event) => updateField("deadline", event.target.value)}
            />
            {fieldErrors.deadline ? (
              <p className="text-sm text-rose-600 dark:text-rose-400">{fieldErrors.deadline}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button color="primary" isLoading={isSubmitting} type="submit">
            Save changes
          </Button>
          <Button variant="bordered" onPress={onCancel} type="button">
            Cancel
          </Button>
        </div>

        {statusMessage.text ? (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-500/10 dark:text-rose-300">
            <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        ) : null}
      </form>
    </div>
  );
}
