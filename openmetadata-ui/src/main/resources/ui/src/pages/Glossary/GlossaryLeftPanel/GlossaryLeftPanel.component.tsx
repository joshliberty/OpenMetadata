/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Button, Col, Menu, MenuProps, Row, Typography } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { ReactComponent as GlossaryIcon } from 'assets/svg/glossary.svg';
import { ReactComponent as PlusIcon } from 'assets/svg/plus-primary.svg';
import LeftPanelCard from 'components/common/LeftPanelCard/LeftPanelCard';
import { usePermissionProvider } from 'components/PermissionProvider/PermissionProvider';
import { ResourceEntity } from 'components/PermissionProvider/PermissionProvider.interface';
import GlossaryV1Skeleton from 'components/Skeleton/GlossaryV1/GlossaryV1LeftPanelSkeleton.component';
import { ROUTES } from 'constants/constants';
import { Operation } from 'generated/entity/policies/policy';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { getEntityName } from 'utils/EntityUtils';
import { checkPermission } from 'utils/PermissionsUtils';
import { getGlossaryPath } from 'utils/RouterUtils';
import Fqn from '../../../utils/Fqn';
import { GlossaryLeftPanelProps } from './GlossaryLeftPanel.interface';

const GlossaryLeftPanel = ({ glossaries }: GlossaryLeftPanelProps) => {
  const { t } = useTranslation();
  const { permissions } = usePermissionProvider();
  const { glossaryName } = useParams<{ glossaryName: string }>();
  const glossaryFqn = glossaryName ? decodeURIComponent(glossaryName) : null;
  const history = useHistory();

  const createGlossaryPermission = useMemo(
    () =>
      checkPermission(Operation.Create, ResourceEntity.GLOSSARY, permissions),
    [permissions]
  );
  const selectedKey = useMemo(() => {
    if (glossaryFqn) {
      return Fqn.split(glossaryFqn)[0];
    }

    return glossaries[0].name;
  }, [glossaryFqn]);

  const menuItems: ItemType[] = useMemo(() => {
    return glossaries.reduce((acc, glossary) => {
      return [
        ...acc,
        {
          key: glossary.fullyQualifiedName ?? '',
          label: getEntityName(glossary),
          icon: <GlossaryIcon height={16} width={16} />,
        },
      ];
    }, [] as ItemType[]);
  }, [glossaries]);

  const handleAddGlossaryClick = () => {
    history.push(ROUTES.ADD_GLOSSARY);
  };
  const handleMenuClick: MenuProps['onClick'] = (event) => {
    history.push(getGlossaryPath(event.key));
  };

  return (
    <LeftPanelCard id="glossary">
      <GlossaryV1Skeleton loading={glossaries.length === 0}>
        <Row className="p-y-xs" gutter={[0, 16]}>
          <Col className="p-x-sm" span={24}>
            <Typography.Text strong className="m-b-0">
              {t('label.glossary')}
            </Typography.Text>
          </Col>

          {createGlossaryPermission && (
            <Col className="p-x-sm" span={24}>
              <Button
                block
                className="text-primary"
                data-testid="add-glossary"
                onClick={handleAddGlossaryClick}>
                <div className="flex-center">
                  <PlusIcon className="anticon m-r-xss" />
                  {t('label.add')}
                </div>
              </Button>
            </Col>
          )}

          <Col span={24}>
            {menuItems.length ? (
              <Menu
                className="custom-menu"
                data-testid="glossary-left-panel"
                items={menuItems}
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
              />
            ) : (
              <p className="text-grey-muted text-center">
                <span>{t('label.no-glossary-found')}</span>
              </p>
            )}
          </Col>
        </Row>
      </GlossaryV1Skeleton>
    </LeftPanelCard>
  );
};

export default GlossaryLeftPanel;
