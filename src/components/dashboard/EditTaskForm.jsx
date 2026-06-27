"use client";

import { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextArea, TextField } from "@heroui/react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { updateTask } from "@/lib/api";

const categories = ["Design", "Writing", "Development", "Marketing", "Other"];

export default function EditTaskForm({ task, onCancel, onUpdated }) {
  const [formValues, setFormValues] = useState({
    title: task?.title || "",
    category: task?.category || "",
    description: task?.description || "",
    budget: task?.budget || "",
    deadline: task?.deadline ? String(task.deadline).slice(0, 10) : "",
  });
  const [statusMessage, setStatusMessage] = useState({ type: "idle", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: String(formValues.title || "").trim(),
      category: String(formValues.category || "").trim(),
      description: String(formValues.description || "").trim(),
      budget: Number(formValues.budget || 0),
      deadline: String(formValues.deadline || "").trim(),
    };

    if (!payload.title || !payload.category || !payload.description || !payload.deadline || !payload.budget) {
      setStatusMessage({ type: "error", text: "Please fill out all required fields before saving." });
      return;
    }

    if (payload.budget <= 0) {
      setStatusMessage({ type: "error", text: "Budget must be greater than zero." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: "idle", text: "" });

    try {
      const response = await updateTask(task._id || task.id, payload);
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

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
      <Form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Edit open task</p>
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Update your task details</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Only open tasks can be edited. Make updates to the title, description, budget, category, or deadline.
          </p>
        </div>

        <TextField
          isRequired
          name="title"
          validate={(value) => {
            if (!value?.trim()) return "Please enter a task title";
            if (value.trim().length < 5) return "Title should be at least 5 characters";
            return null;
          }}
        >
          <Label>Task title</Label>
          <Input
            name="title"
            placeholder="Design a landing page for my startup"
            value={formValues.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
          <FieldError />
        </TextField>

        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <select
            name="category"
            value={formValues.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {!formValues.category ? <p className="text-sm text-rose-600 dark:text-rose-400">Please choose a category</p> : null}
        </div>

        <TextField
          isRequired
          name="description"
          validate={(value) => {
            if (!value?.trim()) return "Please describe what you need";
            if (value.trim().length < 20) return "Description should be at least 20 characters";
            return null;
          }}
        >
          <Label>Description</Label>
          <TextArea
            name="description"
            placeholder="Describe the task, deliverables, style, and any requirements."
            value={formValues.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
          <FieldError />
        </TextField>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            isRequired
            name="budget"
            type="number"
            validate={(value) => {
              const numericValue = Number(value);
              if (!value) return "Please enter a budget";
              if (numericValue <= 0) return "Budget must be greater than zero";
              return null;
            }}
          >
            <Label>Budget (USD)</Label>
            <Input
              name="budget"
              min="1"
              step="1"
              placeholder="150"
              type="number"
              value={formValues.budget}
              onChange={(event) => updateField("budget", event.target.value)}
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="deadline"
            type="date"
            validate={(value) => {
              if (!value) return "Please select a deadline";
              return null;
            }}
          >
            <Label>Deadline</Label>
            <Input
              name="deadline"
              type="date"
              value={formValues.deadline}
              onChange={(event) => updateField("deadline", event.target.value)}
            />
            <FieldError />
          </TextField>
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
      </Form>
    </div>
  );
}
