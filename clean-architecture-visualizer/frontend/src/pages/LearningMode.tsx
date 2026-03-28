import { CADiagram, SideBar } from '../components/diagram';
import Header from '../components/common/Header';
import { PageContainer, Workspace, MainViewContainer } from '../components/diagram/CADiagramPageLayout';
import { LearningPopup } from '../components/diagram/index.ts';

export default function LearningMode() {
    return (
        <PageContainer>
            <Header />
            <Workspace>
                <MainViewContainer>
                    <CADiagram />
                </MainViewContainer>

                <SideBar>
                    <LearningPopup />
                </SideBar>
            </Workspace>
        </PageContainer>
    );
}