/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ComponentEntityV1alpha1,
  componentEntityV1alpha1Validator as validator,
} from './ComponentEntityV1alpha1';

describe('ComponentV1alpha1Validator', () => {
  let entity: ComponentEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'me',
        implementsApis: ['api-0'],
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing lifecycle', async () => {
    delete (entity as any).spec.lifecycle;
    await expect(validator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects wrong lifecycle', async () => {
    (entity as any).spec.lifecycle = 7;
    await expect(validator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects empty lifecycle', async () => {
    (entity as any).spec.lifecycle = '';
    await expect(validator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects wrong owner', async () => {
    (entity as any).spec.owner = 7;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('accepts missing implementsApis', async () => {
    delete (entity as any).spec.implementsApis;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty implementsApis', async () => {
    (entity as any).spec.implementsApis = [''];
    await expect(validator.check(entity)).rejects.toThrow(/implementsApis/);
  });

  it('rejects undefined implementsApis', async () => {
    (entity as any).spec.implementsApis = [undefined];
    await expect(validator.check(entity)).rejects.toThrow(/implementsApis/);
  });

  it('accepts no implementsApis', async () => {
    (entity as any).spec.implementsApis = [];
    await expect(validator.check(entity)).resolves.toBe(true);
  });
});
