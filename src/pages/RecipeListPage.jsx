import { Badge, Box, Button, Container, Flex, Heading, Image, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { ColorModeButton } from '../components/ui/color-mode';
import { RecipeLabels } from '../components/RecipeLabels';
import { filterRecipes } from '../utils/recipes';

export const RecipeListPage = ({ query, onQueryChange, onSelectRecipe, cardRefs }) => {
  const visibleRecipes = filterRecipes(query);

  return (
    <Container maxW="7xl" py={{ base: '6', md: '10' }} px={{ base: '4', md: '8' }}>
      <Flex justify="space-between" direction={{ base: 'column', sm: 'row' }} align="start" gap="4" mb="6">
        <Box minW="0">
          <Text color={{ base: 'orange.700', _dark: 'orange.300' }} fontWeight="bold" letterSpacing="widest">WINC KITCHEN</Text>
          <Heading as="h1" size={{ base: '3xl', md: '5xl' }}>Find your next recipe</Heading>
        </Box>
        <ColorModeButton size="lg" flexShrink="0" />
      </Flex>
      <Text as="label" htmlFor="recipe-search" display="block" fontWeight="semibold" mb="2">Search recipes</Text>
      <Flex gap="3" mb="3">
        <Input id="recipe-search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Try chicken, vegan, gluten-free..." size="lg" minW="0" bg={{ base: 'white', _dark: 'gray.900' }} />
        {query && <Button variant="outline" size="lg" onClick={() => onQueryChange('')}>Clear</Button>}
      </Flex>
      <Text color="fg.muted" fontSize="sm" mb="6">Search by recipe name, health label, or diet label.</Text>
      <Text mb="4" fontWeight="semibold" role="status" aria-live="polite">{visibleRecipes.length} {visibleRecipes.length === 1 ? 'recipe' : 'recipes'} found</Text>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="6">
        {visibleRecipes.map((recipe) => {
          const health = (recipe.healthLabels || []).filter((label) => ['Vegan', 'Vegetarian'].includes(label));
          return (
            <Box key={recipe.label} as="article" onClick={() => onSelectRecipe(recipe)} cursor="pointer" minW="0" overflow="hidden" borderWidth="1px" borderColor={{ base: 'orange.200', _dark: 'gray.700' }} borderRadius="2xl" bg={{ base: 'white', _dark: 'gray.900' }} display="flex" flexDirection="column" _hover={{ shadow: 'lg' }}>
              <Image src={recipe.image} alt={recipe.label} w="100%" h="220px" objectFit="cover" />
              <Flex direction="column" gap="4" p="5" flex="1">
                <Box>
                  <Text fontSize="sm" color={{ base: 'orange.700', _dark: 'orange.300' }}>Meal: {(recipe.mealType || []).join(', ') || 'N/A'}</Text>
                  <Text fontSize="sm" color="fg.muted">Dish: {(recipe.dishType || []).join(', ') || 'N/A'}</Text>
                  <Heading as="h2" size="lg" mt="2">{recipe.label}</Heading>
                </Box>
                <RecipeLabels title="Diet" values={recipe.dietLabels} />
                {health.length > 0 && <Flex gap="2" wrap="wrap">{health.map((label) => <Badge key={label} fontSize="sm" colorPalette="teal" whiteSpace="normal">{label}</Badge>)}</Flex>}
                <RecipeLabels title="Cautions" values={recipe.cautions} colorPalette="red" />
                <Button
                  ref={(element) => { if (element) cardRefs.current.set(recipe.label, element); else cardRefs.current.delete(recipe.label); }}
                  aria-label={`Open ${recipe.label}`}
                  onClick={(event) => { event.stopPropagation(); onSelectRecipe(recipe); }}
                  bg={{ base: 'orange.700', _dark: 'orange.300' }} color={{ base: 'white', _dark: 'gray.950' }} _hover={{ bg: { base: 'orange.800', _dark: 'orange.200' } }} mt="auto" minH="12" w="100%"
                >View recipe</Button>
              </Flex>
            </Box>
          );
        })}
      </SimpleGrid>
      {!visibleRecipes.length && <Box py="12" textAlign="center"><Heading as="h2" size="lg">No recipes found</Heading><Text color="fg.muted">Try another name or label, or clear your search.</Text></Box>}
    </Container>
  );
};
