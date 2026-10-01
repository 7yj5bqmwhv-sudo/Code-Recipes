import { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { RecipeListPage } from './pages/RecipeListPage';
import { RecipePage } from './pages/RecipePage';

export const App = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [query, setQuery] = useState('');
  const headingRef = useRef(null);
  const cardRefs = useRef(new Map());
  const previousRecipe = useRef(null);
  const overviewScroll = useRef(0);

  useEffect(() => {
    if (selectedRecipe) {
      // Run after the detail page mounts, and avoid animated motion.
      window.scrollTo({ top: 0, behavior: 'instant' });
      headingRef.current?.focus({ preventScroll: true });
      document.title = `${selectedRecipe.label} | Winc Kitchen`;
    } else {
      document.title = 'Winc React Recipe App';
      if (previousRecipe.current) {
        window.scrollTo({ top: overviewScroll.current, behavior: 'instant' });
        cardRefs.current.get(previousRecipe.current)?.focus({ preventScroll: true });
      }
    }
  }, [selectedRecipe]);

  const selectRecipe = (recipe) => {
    previousRecipe.current = recipe.label;
    overviewScroll.current = window.scrollY;
    setSelectedRecipe(recipe);
  };

  return (
    <Box as="main" minH="100vh" bg={{ base: 'orange.50', _dark: 'gray.950' }} color="fg" overflowWrap="anywhere">
      {selectedRecipe ? (
        <RecipePage recipe={selectedRecipe} headingRef={headingRef} onBack={() => setSelectedRecipe(null)} />
      ) : (
        <RecipeListPage query={query} onQueryChange={setQuery} onSelectRecipe={selectRecipe} cardRefs={cardRefs} />
      )}
    </Box>
  );
};
