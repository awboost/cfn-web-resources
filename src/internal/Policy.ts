import {
  makePolicyDocument,
  PolicyDocument,
  PolicyStatement,
} from '@awboost/cfntemplate';

export interface Policy {
  PolicyName: string;
  PolicyDocument: PolicyDocument;
}

export function makePolicy(
  name: string,
  statements: PolicyStatement[],
): Policy {
  return {
    PolicyDocument: makePolicyDocument(...statements),
    PolicyName: name,
  };
}
