
export interface Finding {
    id: string;
    label: string;
    confidence: number;
    description: string;
    region?: { x: number; y: number; width: number; height: number }; // percentage 0-100
}

export interface AnalysisResult {
    id: string;
    imageUrl: string; // url or base64
    analysisType: string;
    modelUsed: string;
    findings: Finding[];
    confidence: number;
    camImage?: string; // Class Activation Map overlay if applicable
    timestamp: string;
    processingSteps?: string[]; // For "Glass Box" transparency
}

export type AnalysisType = 'custom' | 'report-generation' | 'disease-classification';

export const ANALYSIS_TYPES = [
    { id: 'custom', label: 'Build Your Own Analysis', description: 'Create custom analysis workflow' },
    { id: 'report-generation', label: 'Report Generation', description: 'Detects lung capacity and diseases' },
    { id: 'disease-classification', label: 'Disease Classification', description: 'Identify and classify medical conditions' },
];

export const AVAILABLE_MODELS = [
    { id: 'densenet121', label: 'DenseNet121 (Chest X-Ray)' },
    { id: 'resnet50', label: 'ResNet50 (General Medical)' },
    { id: 'vit-b16', label: 'ViT-B/16 (Dermatology)' },
    { id: 'custom-model', label: 'Custom Model API' },
];

// Mock function to simulate analysis
export const analyzeImage = async (
    file: File,
    type: AnalysisType,
    modelId: string
): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: crypto.randomUUID(),
                imageUrl: URL.createObjectURL(file), // In real app, this would be a cloud URL
                analysisType: type,
                modelUsed: modelId,
                findings: [
                    {
                        id: 'f1',
                        label: 'Consolidation',
                        confidence: 0.89,
                        description: 'Opacification observed in the lower right lobe consistent with pneumonia.',
                        region: { x: 60, y: 65, width: 20, height: 15 }
                    },
                    {
                        id: 'f2',
                        label: 'Cardiomegaly',
                        confidence: 0.45,
                        description: 'Cardiac silhouette is borderline enlarged.',
                        region: { x: 35, y: 40, width: 30, height: 35 }
                    }
                ],
                confidence: 0.89,
                timestamp: new Date().toISOString(),
                processingSteps: [
                    'Preprocessing: Histogram Equalization',
                    'Segmentation: U-Net Lung Mask extraction',
                    'Feature Extraction: DenseNet121 Layer 4 Block 2',
                    'Classification: Multi-label sigmoid activation',
                    'Explainability: Grad-CAM heatmap generation'
                ]
            });
        }, 2500); // Simulate network latency
    });
};
