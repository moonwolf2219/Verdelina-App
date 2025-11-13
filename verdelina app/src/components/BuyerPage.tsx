import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Filter, Phone, MapPin, ChevronLeft, ChevronRight, Play, CreditCard, Heart, Share2, Star, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import UserSettings from './UserSettings';

interface BuyerPageProps {
  language: Language;
  viewableListings: number;
  onRequestMore: () => void;
  onBack: () => void;
  farmerName?: string;
}

const translations = {
  english: {
    title: 'Browse Machinery',
    subtitle: 'Find the perfect machinery for your farm',
    search: 'Search machinery...',
    filterType: 'Filter by type',
    all: 'All Types',
    contact: 'Contact Seller',
    location: 'Location',
    condition: 'Condition',
    viewDetails: 'View Details',
    frontView: 'Front',
    backView: 'Back',
    leftView: 'Left',
    rightView: 'Right',
    video: 'Video',
    viewingListings: 'Viewing listings',
    of: 'of',
    unlockMore: 'Unlock 10 More Listings',
    payToView: 'Pay ₹125 to view more machinery',
    viewedAll: 'You\'ve viewed all available listings in your package'
  },
  telugu: {
    title: 'యంత్రాలను బ్రౌజ్ చేయండి',
    subtitle: 'మీ పొలానికి సరైన యంత్రాన్ని కనుగొనండి',
    search: 'యంత్రాలను శోధించండి...',
    filterType: 'రకం ద్వారా ఫిల్టర్ చేయండి',
    all: 'అన్ని రకాలు',
    contact: 'విక్రేతను సంప్రదించండి',
    location: 'స్థానం',
    condition: 'స్థితి',
    viewDetails: 'వివరాలను చూడండి',
    frontView: 'ముందు',
    backView: 'వెనుక',
    leftView: 'ఎడమ',
    rightView: 'కుడి',
    video: 'వీడియో',
    viewingListings: 'జాబితాలను చూస్తున్నారు',
    of: 'లో',
    unlockMore: 'మరో 10 జాబితాలను అన్‌లాక్ చేయండి',
    payToView: 'మరిన్ని యంత్రాలను చూడటానికి ₹125 చెల్లించండి',
    viewedAll: 'మీరు మీ ప్యాకేజీలోని అందుబాటులో ఉన్న అన్ని జాబితాలను చూశారు'
  }
};

const mockListings = [
  {
    id: 1,
    name: 'John Deere 5045D',
    type: 'Tractor',
    price: '₹8,50,000',
    condition: 'Excellent',
    location: 'Karimnagar, Telangana',
    sellerPhone: '+91 98765 43210',
    images: {
      front: 'https://images.unsplash.com/photo-1695566775365-0a2fb08ee4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1683552515328-5a8d58755e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0cmFjdG9yfGVufDF8fHx8MTc1OTk0NjQ3NXww&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1618346976725-71ee4a1ecc89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRyYWN0b3J8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video1.mp4'
  },
  {
    id: 2,
    name: 'Mahindra 575 DI',
    type: 'Tractor',
    price: '₹6,75,000',
    condition: 'Good',
    location: 'Warangal, Telangana',
    sellerPhone: '+91 98765 43211',
    images: {
      front: 'https://images.unsplash.com/photo-1683552515328-5a8d58755e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0cmFjdG9yfGVufDF8fHx8MTc1OTk0NjQ3NXww&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1695566775365-0a2fb08ee4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1618346976725-71ee4a1ecc89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRyYWN0b3J8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video2.mp4'
  },
  {
    id: 3,
    name: 'Combine Harvester',
    type: 'Harvester',
    price: '₹15,00,000',
    condition: 'Excellent',
    location: 'Nizamabad, Telangana',
    sellerPhone: '+91 98765 43212',
    images: {
      front: 'https://images.unsplash.com/photo-1565647952915-9644fcd446a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBoYXJ2ZXN0ZXJ8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1635174815612-fd9636f70146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21iaW5lJTIwaGFydmVzdGVyfGVufDF8fHx8MTc1OTk0NjQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1565647952915-9644fcd446a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBoYXJ2ZXN0ZXJ8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1635174815612-fd9636f70146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21iaW5lJTIwaGFydmVzdGVyfGVufDF8fHx8MTc1OTk0NjQ3OHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video3.mp4'
  },
  {
    id: 4,
    name: 'Rotary Tiller',
    type: 'Tiller',
    price: '₹95,000',
    condition: 'Good',
    location: 'Khammam, Telangana',
    sellerPhone: '+91 98765 43213',
    images: {
      front: 'https://images.unsplash.com/photo-1758873263527-ca53b938fbd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RhcnklMjB0aWxsZXJ8ZW58MXx8fHwxNzU5OTQ3ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1532929900024-6413d2ed39c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxsZXIlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU5OTQ3NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1758873263527-ca53b938fbd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RhcnklMjB0aWxsZXJ8ZW58MXx8fHwxNzU5OTQ3ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1532929900024-6413d2ed39c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxsZXIlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU5OTQ3NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video4.mp4'
  },
  {
    id: 5,
    name: 'Power Sprayer',
    type: 'Sprayer',
    price: '₹45,000',
    condition: 'Excellent',
    location: 'Adilabad, Telangana',
    sellerPhone: '+91 98765 43214',
    images: {
      front: 'https://images.unsplash.com/photo-1596289414984-7b7ae58fbd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJheWVyJTIwbWFjaGluZXxlbnwxfHx8fDE3NTk5NDc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1596289414984-7b7ae58fbd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJheWVyJTIwbWFjaGluZXxlbnwxfHx8fDE3NTk5NDc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1596289414984-7b7ae58fbd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJheWVyJTIwbWFjaGluZXxlbnwxfHx8fDE3NTk5NDc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1596289414984-7b7ae58fbd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJheWVyJTIwbWFjaGluZXxlbnwxfHx8fDE3NTk5NDc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video5.mp4'
  },
  {
    id: 6,
    name: 'Seed Drill',
    type: 'Seeder',
    price: '₹75,000',
    condition: 'Good',
    location: 'Hyderabad, Telangana',
    sellerPhone: '+91 98765 43215',
    images: {
      front: 'https://images.unsplash.com/photo-1706862609885-7771b001daa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkZXIlMjBtYWNoaW5lfGVufDF8fHx8MTc1OTk0NzY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1706862609885-7771b001daa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkZXIlMjBtYWNoaW5lfGVufDF8fHx8MTc1OTk0NzY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1706862609885-7771b001daa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkZXIlMjBtYWNoaW5lfGVufDF8fHx8MTc1OTk0NzY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1706862609885-7771b001daa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkZXIlMjBtYWNoaW5lfGVufDF8fHx8MTc1OTk0NzY3MHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video6.mp4'
  },
  {
    id: 7,
    name: 'Disc Plough',
    type: 'Plough',
    price: '₹55,000',
    condition: 'Fair',
    location: 'Nalgonda, Telangana',
    sellerPhone: '+91 98765 43216',
    images: {
      front: 'https://images.unsplash.com/photo-1727514606723-54581e9562ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbG91Z2glMjBwbG93fGVufDF8fHx8MTc1OTk0NjkyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1727514606723-54581e9562ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbG91Z2glMjBwbG93fGVufDF8fHx8MTc1OTk0NjkyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1727514606723-54581e9562ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbG91Z2glMjBwbG93fGVufDF8fHx8MTc1OTk0NjkyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1727514606723-54581e9562ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbG91Z2glMjBwbG93fGVufDF8fHx8MTc1OTk0NjkyMHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video7.mp4'
  },
  {
    id: 8,
    name: 'Kubota L4508',
    type: 'Tractor',
    price: '₹7,25,000',
    condition: 'Excellent',
    location: 'Medak, Telangana',
    sellerPhone: '+91 98765 43217',
    images: {
      front: 'https://images.unsplash.com/photo-1618346976725-71ee4a1ecc89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRyYWN0b3J8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1695566775365-0a2fb08ee4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1683552515328-5a8d58755e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0cmFjdG9yfGVufDF8fHx8MTc1OTk0NjQ3NXww&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video8.mp4'
  },
  {
    id: 9,
    name: 'Paddy Harvester',
    type: 'Harvester',
    price: '₹12,50,000',
    condition: 'Good',
    location: 'Rangareddy, Telangana',
    sellerPhone: '+91 98765 43218',
    images: {
      front: 'https://images.unsplash.com/photo-1635174815612-fd9636f70146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21iaW5lJTIwaGFydmVzdGVyfGVufDF8fHx8MTc1OTk0NjQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1565647952915-9644fcd446a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBoYXJ2ZXN0ZXJ8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1635174815612-fd9636f70146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21iaW5lJTIwaGFydmVzdGVyfGVufDF8fHx8MTc1OTk0NjQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1565647952915-9644fcd446a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBoYXJ2ZXN0ZXJ8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video9.mp4'
  },
  {
    id: 10,
    name: 'New Holland 3600-2',
    type: 'Tractor',
    price: '₹5,95,000',
    condition: 'Fair',
    location: 'Mancherial, Telangana',
    sellerPhone: '+91 98765 43219',
    images: {
      front: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      back: 'https://images.unsplash.com/photo-1618346976725-71ee4a1ecc89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRyYWN0b3J8ZW58MXx8fHwxNzU5OTQ3ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      left: 'https://images.unsplash.com/photo-1695566775365-0a2fb08ee4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      right: 'https://images.unsplash.com/photo-1683552515328-5a8d58755e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0cmFjdG9yfGVufDF8fHx8MTc1OTk0NjQ3NXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    videoUrl: 'https://example.com/video10.mp4'
  }
];

export default function BuyerPage({ language, viewableListings, onRequestMore, onBack, farmerName = 'Farmer' }: BuyerPageProps) {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedListing, setSelectedListing] = useState<typeof mockListings[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: number]: number}>({});
  const [showVideo, setShowVideo] = useState<{[key: number]: boolean}>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
    toast.success(
      favorites.includes(id)
        ? (language === 'english' ? 'Removed from favorites' : 'ఇష్టాలు నుండి తీసివేయబడింది')
        : (language === 'english' ? 'Added to favorites' : 'ఇష్టాలకు జోడించబడింది')
    );
  };

  const handleShare = (listing: typeof mockListings[0]) => {
    toast.success(language === 'english' ? 'Share link copied!' : 'షేర్ లింక్ కాపీ చేయబడింది!');
  };

  const handleContactSeller = (listing: typeof mockListings[0]) => {
    toast.success(
      language === 'english' 
        ? `Seller contact revealed: ${listing.sellerPhone}` 
        : `విక్రేత సంప్రదింపు బహిర్గతం: ${listing.sellerPhone}`
    );
  };

  const visibleListings = mockListings.slice(0, viewableListings);
  const filteredListings = visibleListings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || listing.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getImageArray = (listing: typeof mockListings[0]) => [
    listing.images.front,
    listing.images.back,
    listing.images.left,
    listing.images.right
  ];

  const nextImage = (listingId: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % 4
    }));
    setShowVideo(prev => ({ ...prev, [listingId]: false }));
  };

  const prevImage = (listingId: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + 4) % 4
    }));
    setShowVideo(prev => ({ ...prev, [listingId]: false }));
  };

  const toggleVideo = (listingId: number) => {
    setShowVideo(prev => ({ ...prev, [listingId]: !prev[listingId] }));
  };

  const getImageLabel = (index: number) => {
    const labels = [t.frontView, t.backView, t.leftView, t.rightView];
    return labels[index];
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/20 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'english' ? 'Back' : 'వెనుకకు'}
            </Button>
            <UserSettings 
              language={language} 
              farmerName={farmerName}
              onLogout={() => {
                toast.info(language === 'english' ? 'Logged out successfully' : 'విజయవంతంగా లాగ్ అవుట్ అయింది');
              }}
            />
          </div>
          <h1 className="text-2xl mb-1">{t.title}</h1>
          <p className="text-white/90">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Viewing Status */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {t.viewingListings} {visibleListings.length} {t.of} {mockListings.length}
          </p>
          {viewableListings < mockListings.length && (
            <Button
              onClick={onRequestMore}
              variant="outline"
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {t.unlockMore}
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.search}
              className="h-12 rounded-xl pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 h-12 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t.filterType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="tractor">Tractor</SelectItem>
              <SelectItem value="harvester">Harvester</SelectItem>
              <SelectItem value="tiller">Tiller</SelectItem>
              <SelectItem value="plough">Plough</SelectItem>
              <SelectItem value="seeder">Seeder</SelectItem>
              <SelectItem value="sprayer">Sprayer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {filteredListings.map((listing, index) => {
              const currentIdx = currentImageIndex[listing.id] || 0;
              const images = getImageArray(listing);
              const isShowingVideo = showVideo[listing.id];

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Image Gallery */}
                    <div className="relative h-56 bg-gray-200">
                      {!isShowingVideo ? (
                        <>
                          <ImageWithFallback
                            src={images[currentIdx]}
                            alt={listing.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs">
                            {getImageLabel(currentIdx)}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Play className="w-16 h-16 text-white" />
                          <p className="absolute text-white text-sm">{t.video}</p>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <button
                        onClick={() => prevImage(listing.id)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5 text-[#2E7D32]" />
                      </button>
                      <button
                        onClick={() => nextImage(listing.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5 text-[#2E7D32]" />
                      </button>

                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        >
                          <Heart 
                            className={`w-4 h-4 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                          />
                        </button>
                        <button
                          onClick={() => handleShare(listing)}
                          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        >
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Video Toggle Button */}
                      <button
                        onClick={() => toggleVideo(listing.id)}
                        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white rounded-lg px-3 py-1 shadow-lg flex items-center gap-1"
                      >
                        <Play className="w-4 h-4 text-[#2E7D32]" />
                        <span className="text-xs text-[#2E7D32]">{t.video}</span>
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentImageIndex(prev => ({ ...prev, [listing.id]: idx }));
                              setShowVideo(prev => ({ ...prev, [listing.id]: false }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              idx === currentIdx && !isShowingVideo ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg text-[#2E7D32]">{listing.name}</h3>
                        <Badge className="bg-[#4CAF50] text-white">{listing.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 mt-3">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600">
                          {t.condition}: <span className="text-[#4CAF50]">{listing.condition}</span>
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.5</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedListing(listing)}
                          className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#45A049] text-white rounded-xl"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {t.contact}
                        </Button>
                        <Button
                          onClick={() => toast.info(language === 'english' ? 'Viewing details...' : 'వివరాలు చూస్తోంది...')}
                          variant="outline"
                          className="h-10 px-4 rounded-xl"
                        >
                          {t.viewDetails}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Unlock More Section */}
        {viewableListings < mockListings.length && filteredListings.length === visibleListings.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <CreditCard className="w-16 h-16 text-[#4CAF50] mx-auto mb-4" />
            <h3 className="text-2xl text-[#2E7D32] mb-2">{t.unlockMore}</h3>
            <p className="text-gray-600 mb-6">{t.payToView}</p>
            <Button
              onClick={onRequestMore}
              className="h-12 px-8 bg-[#4CAF50] hover:bg-[#45A049] text-white rounded-xl"
            >
              {t.unlockMore}
            </Button>
          </motion.div>
        )}

        {viewableListings >= mockListings.length && (
          <div className="bg-green-50 rounded-2xl p-6 text-center">
            <p className="text-[#2E7D32]">{t.viewedAll}</p>
          </div>
        )}
      </div>

      {/* Contact Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2E7D32]">{t.contact}</DialogTitle>
            <DialogDescription>
              {language === 'english' ? 'Contact the seller to discuss this machinery' : 'ఈ యంత్రం గురించి చర్చించడానికి విక్రేతను సంప్రదించండి'}
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg text-[#2E7D32] mb-2">{selectedListing.name}</h4>
                <div className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white rounded-xl p-4 mb-3">
                  <p className="text-sm opacity-90 mb-1">{language === 'english' ? 'Price:' : 'ధర:'}</p>
                  <p className="text-3xl">{selectedListing.price}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {t.condition}: <span className="text-[#4CAF50]">{selectedListing.condition}</span>
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedListing.location}
                </p>
              </div>
              <div className="bg-[#4CAF50]/10 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">{language === 'english' ? 'Contact Number:' : 'సంప్రదించండి నంబర్:'}</p>
                <a
                  href={`tel:${selectedListing.sellerPhone}`}
                  className="text-xl text-[#4CAF50] flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  {selectedListing.sellerPhone}
                </a>
              </div>
              <Button
                onClick={() => setSelectedListing(null)}
                className="w-full h-12 bg-[#4CAF50] hover:bg-[#45A049] text-white rounded-xl"
              >
                {language === 'english' ? 'Close' : 'మూసివేయండి'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
