"use client";

import React from 'react';
import { Typography, Link } from '@mui/material';
import { parseMessageWithLinks } from '@/utils/linkUtils';

interface MessageWithLinksProps {
  message: string;
  sx?: object;
}

export const MessageWithLinks: React.FC<MessageWithLinksProps> = ({ message, sx }) => {
  const parts = parseMessageWithLinks(message);

  return (
    <Typography sx={sx}>
      {parts.map((part, index) => {
        if (part.type === 'link') {
          return (
            <Link
              key={index}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'inherit',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'underline',
                  opacity: 0.8
                }
              }}
            >
              {part.content}
            </Link>
          );
        }
        return part.content;
      })}
    </Typography>
  );
};