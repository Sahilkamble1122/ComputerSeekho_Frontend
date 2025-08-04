import { Button } from "@/components/ui/button";

export default function Pagination({ page, hasMore, onPrev, onNext }) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button variant="outline" onClick={onPrev} disabled={page === 1}>
        Previous
      </Button>
      <Button variant="outline" onClick={onNext} disabled={!hasMore}>
        Next
      </Button>
    </div>
  );
}
