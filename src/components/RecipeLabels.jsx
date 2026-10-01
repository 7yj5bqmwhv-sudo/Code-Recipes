import { Badge, Box, Flex, Text } from '@chakra-ui/react';

export const RecipeLabels = ({ title, values = [], colorPalette = 'green' }) => (
  <Box>
    <Text fontWeight="semibold" mb="2">{title}</Text>
    {values.length ? (
      <Flex gap="2" wrap="wrap">
        {values.map((value) => (
          <Badge key={value} colorPalette={colorPalette} variant="subtle" fontSize="sm" whiteSpace="normal" overflowWrap="anywhere">
            {value}
          </Badge>
        ))}
      </Flex>
    ) : (
      <Text color="fg.muted" fontSize="sm">Not provided in the source data.</Text>
    )}
  </Box>
);
