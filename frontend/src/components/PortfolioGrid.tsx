'use client';

import { useState } from 'react';
import type { PortfolioItem } from '@/lib/types';
import { categoryLabels } from '@/lib/types';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

// Extract video ID from various video URLs
function getVideoEmbed(mediaType: string | undefined, mediaUrl: string | undefined) {
  if (!mediaUrl || !mediaType) return null;

  // YouTube
  if (mediaType === 'youtube') {
    const match = mediaUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${match[1]}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full absolute inset-0"
          loading="lazy"
        />
      );
    }
  }

  // Instagram
  if (mediaType === 'instagram') {
    const match = mediaUrl.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return (
        <iframe
          src={`https://www.instagram.com/p/${match[1]}/embed`}
          title="Instagram post"
          allowFullScreen
          className="w-full h-full absolute inset-0"
          loading="lazy"
        />
      );
    }
  }

  // TikTok
  if (mediaType === 'tiktok') {
    const match = mediaUrl.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    if (match) {
      return (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${match[1]}`}
          title="TikTok video"
          allowFullScreen
          className="w-full h-full absolute inset-0"
          loading="lazy"
        />
      );
    }
  }

  // Twitter/X
  if (mediaType === 'twitter') {
    return (
      <div className="flex items-center justify-center h-full bg-ima-surface text-ima-text-secondary">
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-ima-primary hover:underline">
          View on X/Twitter
        </a>
      </div>
    );
  }

  return null;
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const [showVideo, setShowVideo] = useState(false);
  const hasVideo = item.media_type && item.media_type !== 'image' && item.media_url;

  return (
    <div
      className="group bg-ima-background border border-ima-border rounded-xl overflow-hidden hover:border-ima-surface-hover transition-all duration-300"
      data-testid={`portfolio-item-${item.id}`}
    >
      {/* Media */}
      <div className="relative aspect-video bg-ima-surface">
        {showVideo && hasVideo ? (
          <div className="absolute inset-0">
            {getVideoEmbed(item.media_type, item.media_url)}
          </div>
        ) : (
          <>
            {item.thumbnail_url && (
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            {hasVideo && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                data-testid={`play-video-${item.id}`}
              >
                <div className="w-16 h-16 rounded-full bg-ima-primary flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </>
        )}
        {/* Category Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ima-background/80 text-xs font-medium text-white">
          {categoryLabels[item.category]}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading font-bold text-lg text-white mb-2">{item.title}</h3>
        <p className="text-ima-text-secondary text-sm mb-4 line-clamp-2">{item.description}</p>
        
        {/* Tools */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tools_used.slice(0, 3).map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 rounded bg-ima-surface text-xs text-ima-text-secondary"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="text-ima-primary text-sm font-medium hover:underline"
          data-testid={`request-project-${item.id}`}
        >
          Request Similar Project →
        </button>
      </div>
    </div>
  );
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'graphics', 'video', 'social_media', 'ai_automation'];
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-ima-primary text-white'
                : 'bg-ima-surface text-ima-text-secondary hover:text-white'
            }`}
            data-testid={`filter-${cat}`}
          >
            {cat === 'all' ? 'All Work' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-ima-text-secondary py-12">
          No items found in this category.
        </p>
      )}
    </div>
  );
}
