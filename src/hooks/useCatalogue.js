import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

const extractList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.produits)) return data.produits;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export function useCatalogue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorisIds, setFavorisIds] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let cancelled = false;

    api
      .get('/produits')
      .then((res) => {
        if (cancelled) return;
        setProduits(extractList(res.data));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Erreur chargement produits:', err);
        setProduits([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;

    api
      .get('/client/favoris')
      .then((res) => {
        if (cancelled) return;
        const list = extractList(res.data);
        setFavorisIds(
          list.map((item) => item.id ?? item.produit_id).filter(Boolean)
        );
      })
      .catch(() => {
        if (!cancelled) setFavorisIds([]);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const fetchProduits = useCallback(async (query = '') => {
    const trimmed = query.trim();
    setSearchQuery(query);
    setLoading(true);

    try {
      const url = trimmed
        ? `/produits?search=${encodeURIComponent(trimmed)}`
        : '/produits';
      const res = await api.get(url);
      setProduits(extractList(res.data));
    } catch (err) {
      console.error('Erreur recherche produits:', err);
      setProduits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleFavori = async (produitId) => {
    if (!user) return navigate('/login');

    try {
      await api.post(`/client/favoris/${produitId}`);
      setFavorisIds((prev) =>
        prev.includes(produitId)
          ? prev.filter((id) => id !== produitId)
          : [...prev, produitId]
      );
    } catch (err) {
      console.error('Erreur favori:', err);
    }
  };

  const handleSelectProduit = (produit) => {
    if (user && produit?.id) {
      api.post(`/client/historique/${produit.id}`).catch(() => {});
    }
  };

  const resetFiltres = useCallback(() => {
    setSelectedCategory('');
    fetchProduits('');
  }, [fetchProduits]);

  return {
    produits,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    favorisIds,
    feedback,
    setFeedback,
    fetchProduits,
    handleToggleFavori,
    handleSelectProduit,
    resetFiltres,
  };
}