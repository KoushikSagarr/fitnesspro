import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { Card, CardContent } from '../components/ui';
import './PlaceholderPage.css';

interface PlaceholderPageProps {
    title: string;
    icon: string;
    description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon, description }) => {
    return (
        <div className="placeholder-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="placeholder-content"
            >
                <Card variant="gradient" className="placeholder-card">
                    <CardContent>
                        <span className="placeholder-icon">{icon}</span>
                        <h1 className="placeholder-title">{title}</h1>
                        <p className="placeholder-description">{description}</p>
                        <div className="coming-soon-badge">
                            <Construction size={16} />
                            <span>Coming Soon</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default PlaceholderPage;
