
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddStudyPlanProps {
    onGenerate: (topic: string) => Promise<boolean>;
}

export function AddStudyPlan({ onGenerate }: AddStudyPlanProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast({
                title: 'Topic is required',
                description: 'Please enter a topic to generate a plan.',
                variant: 'destructive',
            });
            return;
        }
        setIsGenerating(true);
        const success = await onGenerate(topic);
        setIsGenerating(false);
        if (success) {
            setTopic('');
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Topic
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to Study Plan</DialogTitle>
                    <DialogDescription>
                        Enter a topic or chapter, and our AI will generate a personalized study plan for it.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="topic" className="text-right">
                            Topic
                        </Label>
                        <Input
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., 'Quantum Physics' or 'Chapter 5'"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <Loader className="mr-2 animate-spin" /> : null}
                        {isGenerating ? 'Generating...' : 'Generate Plan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

