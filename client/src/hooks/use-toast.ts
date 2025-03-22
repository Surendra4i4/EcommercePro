import { useToast as useToastOriginal } from "@/components/ui/use-toast";

export { useToast };

// Re-export the hook to maintain consistent imports across the app
function useToast() {
  return useToastOriginal();
}
