import {StyleSheet} from 'react-native';
import theme from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.DARK,
    height: '100%',
    color: theme.COLORS.WHITE,
    paddingHorizontal: theme.SIZE.XL,
    paddingVertical: 10,
  },
  gap: {
    height: theme.SIZE.XL,
  },
  gap2: {
    height: theme.SIZE.XL * 2,
  },
  gapX: {
    width: theme.SIZE.SM,
  },
  gapX2: {
    width: theme.SIZE.SM * 2,
  },
  input: {
    backgroundColor: theme.COLORS.WHITE,
    opacity: 0.6,
    margin: 1,
    borderRadius: 5,
    padding: 2,
    paddingVertical: 0,
    fontSize: theme.SIZE.MD,
    fontWeight: 'bold',
    color: theme.COLORS.DARK,
  },
  h4: {
    fontSize: theme.SIZE.LG,
    fontWeight: 'bold',
    color: theme.COLORS.WHITE,
  },
});
