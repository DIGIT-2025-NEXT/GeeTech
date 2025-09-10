"use client";

import React from "react";
import {
  SmartToy as AIIcon,
  Factory as ManufacturingIcon,
  Nature as EnvironmentIcon,
  Restaurant as FoodIcon,
  LocalHospital as HealthcareIcon,
  Business as DefaultIcon,
} from "@mui/icons-material";

// 業界アイコンと色のマッピング
const industryConfig: { [key: string]: { icon: React.ReactElement; color: string; bgColor: string } } = {
  "AI・地域活性化": {
    icon: <AIIcon />,
    color: "#1976d2", // 青
    bgColor: "#e3f2fd"
  },
  "製造業向けSaaS": {
    icon: <ManufacturingIcon />,
    color: "#757575", // グレー
    bgColor: "#f5f5f5"
  },
  "環境エネルギー": {
    icon: <EnvironmentIcon />,
    color: "#388e3c", // 緑
    bgColor: "#e8f5e8"
  },
  "フードテック": {
    icon: <FoodIcon />,
    color: "#f57c00", // オレンジ
    bgColor: "#fff3e0"
  },
  "ヘルスケアIT": {
    icon: <HealthcareIcon />,
    color: "#d32f2f", // 赤
    bgColor: "#ffebee"
  }
};

interface IndustryIconProps {
  industry: string;
  size?: number;
  showBackground?: boolean;
}

export const IndustryIcon: React.FC<IndustryIconProps> = ({ 
  industry, 
  size = 16, 
  showBackground = false 
}) => {
  const config = industryConfig[industry] || {
    icon: <DefaultIcon />,
    color: "#757575",
    bgColor: "#f5f5f5"
  };

  const iconElement = React.cloneElement(config.icon, {
    sx: {
      fontSize: size,
      color: config.color,
      ...(showBackground && {
        backgroundColor: config.bgColor,
        borderRadius: "50%",
        padding: "4px",
      })
    }
  });

  return iconElement;
};