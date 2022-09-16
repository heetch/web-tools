import { Helper, theme as flamingo } from '@heetch/flamingo-react';
import styled from 'styled-components';

export const ErrorHelper = styled(Helper)`
  margin-top: 0;
  color: ${flamingo.color_v3.feedback.error} !important;
`;
