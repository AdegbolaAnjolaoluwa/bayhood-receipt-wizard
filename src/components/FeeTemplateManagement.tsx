import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { FeeTemplate, FeeCategory } from '@/types/feeTemplate';
import { getFeeTemplates, createFeeTemplate, updateFeeTemplate, deleteFeeTemplate } from '@/services/feeTemplateService';

const FeeTemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<FeeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FeeTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as FeeCategory | '',
    amount: '',
    description: '',
  });

  const categories: FeeCategory[] = ['Tuition', 'Books', 'Transport', 'Uniform', 'Examination', 'Activities', 'Other'];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await getFeeTemplates();
    setTemplates(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingTemplate) {
        const updated = await updateFeeTemplate(editingTemplate.id, {
          name: formData.name,
          category: formData.category as FeeCategory,
          amount: parseFloat(formData.amount),
          description: formData.description || null,
        });
        
        if (updated) {
          setTemplates(templates.map(t => t.id === editingTemplate.id ? updated : t));
          toast({
            title: "Success",
            description: "Fee template updated successfully",
          });
        }
      } else {
        const created = await createFeeTemplate({
          name: formData.name,
          category: formData.category as FeeCategory,
          amount: parseFloat(formData.amount),
          description: formData.description || undefined,
          is_active: true,
        });
        
        if (created) {
          setTemplates([...templates, created]);
          toast({
            title: "Success",
            description: "Fee template created successfully",
          });
        }
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save fee template",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (template: FeeTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category as FeeCategory,
      amount: template.amount.toString(),
      description: template.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (template: FeeTemplate) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      const success = await deleteFeeTemplate(template.id);
      if (success) {
        setTemplates(templates.filter(t => t.id !== template.id));
        toast({
          title: "Success",
          description: "Fee template deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete fee template",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      amount: '',
      description: '',
    });
    setEditingTemplate(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Tuition': 'bg-blue-100 text-blue-800',
      'Books': 'bg-green-100 text-green-800',
      'Transport': 'bg-yellow-100 text-yellow-800',
      'Uniform': 'bg-purple-100 text-purple-800',
      'Examination': 'bg-red-100 text-red-800',
      'Activities': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['Other'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fee templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Fee Structure Templates</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Fee Template' : 'Create Fee Template'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., School Fees - Term 1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as FeeCategory})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦) *
                </label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(template)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(template)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge className={getCategoryColor(template.category)}>
                {template.category}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg">₦{template.amount.toLocaleString()}</span>
                </div>
                {template.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No fee templates created yet</p>
          <p className="text-gray-400">Create your first template to get started</p>
        </div>
      )}
    </div>
  );
};

export default FeeTemplateManagement;