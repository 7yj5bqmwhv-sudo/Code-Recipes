import { Box, Button, Container, Flex, Grid, Heading, Image, List, Separator, Text } from '@chakra-ui/react';
import { ColorModeButton } from '../components/ui/color-mode';
import { RecipeLabels } from '../components/RecipeLabels';
import { formatNutrient, nutrients } from '../utils/recipes';

export const RecipePage = ({ recipe, onBack, headingRef }) => (
  <Container maxW="6xl" py={{ base: '4', md: '8' }} px={{ base: '4', md: '8' }}>
    <Flex justify="space-between" align="center" wrap="wrap" gap="3" mb="6">
      <Button onClick={onBack} variant="outline" minH="12">Back to recipes</Button>
      <ColorModeButton size="lg" flexShrink="0" />
    </Flex>
    <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1.05fr) minmax(0, 1fr)' }} gap={{ base: '6', lg: '10' }}>
      <Image src={recipe.image} alt={recipe.label} w="100%" maxH="560px" objectFit="cover" borderRadius="2xl" shadow="lg" />
      <Box minW="0">
        <Text color={{ base: 'orange.700', _dark: 'orange.300' }}>Meal: {(recipe.mealType || []).join(', ') || 'N/A'}</Text>
        <Text color="fg.muted">Dish: {(recipe.dishType || []).join(', ') || 'N/A'}</Text>
        <Heading as="h1" ref={headingRef} tabIndex={-1} size={{ base: '3xl', md: '4xl' }} mt="2" mb="5" _focusVisible={{ outline: '2px solid', outlineColor: 'orange.500', outlineOffset: '4px' }}>{recipe.label}</Heading>
        <Flex gap="6" mb="6" wrap="wrap">
          <Box><Text color="fg.muted">Servings</Text><Text fontSize="2xl" fontWeight="bold">{recipe.yield || 'N/A'}</Text></Box>
          <Box><Text color="fg.muted">Cooking time</Text><Text fontSize="2xl" fontWeight="bold">{recipe.totalTime > 0 ? `${recipe.totalTime} min` : 'N/A'}</Text></Box>
        </Flex>
        <Flex direction="column" gap="5">
          <RecipeLabels title="Diet" values={recipe.dietLabels} />
          <RecipeLabels title="Health labels" values={recipe.healthLabels} colorPalette="teal" />
          <RecipeLabels title="Cautions" values={recipe.cautions} colorPalette="red" />
        </Flex>
      </Box>
    </Grid>
    <Grid templateColumns={{ base: 'minmax(0, 1fr)', md: 'minmax(0, 1.3fr) minmax(0, 1fr)' }} gap="6" mt="10">
      <Box minW="0" bg={{ base: 'white', _dark: 'gray.900' }} p={{ base: '5', md: '8' }} borderRadius="2xl" borderWidth="1px">
        <Heading as="h2" size="xl" mb="5">Ingredients</Heading>
        <List.Root gap="3" ps="5">
          {(recipe.ingredientLines || []).map((ingredient, position) => (
            <List.Item key={recipe.ingredientLineIds[position]}>{ingredient}</List.Item>
          ))}
        </List.Root>
      </Box>
      <Box minW="0" bg={{ base: 'white', _dark: 'gray.900' }} p={{ base: '5', md: '8' }} borderRadius="2xl" borderWidth="1px">
        <Heading as="h2" size="xl" mb="2">Total nutrition</Heading>
        <Text color="fg.muted" fontSize="sm" mb="5">For the whole recipe ({recipe.yield} servings).</Text>
        {nutrients.map(([label, key]) => (
          <Box key={key}>
            <Flex justify="space-between" gap="3" wrap="wrap"><Text>{label}</Text><Text fontWeight="bold">{formatNutrient(recipe, key)}</Text></Flex>
            <Separator my="3" />
          </Box>
        ))}
      </Box>
    </Grid>
  </Container>
);
