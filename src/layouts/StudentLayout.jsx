import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer/Footer';
import OfflineBanner from '../components/ui/OfflineBanner/OfflineBanner';
import { studentNavigation } from '../config/roleNavigation';

const StudentLayout = () => (
	<div className="flex min-h-dvh overflow-x-hidden bg-slate-50">
		<OfflineBanner />
		<Sidebar navigationItems={studentNavigation} portalLabel="Student Portal" showSettings={false} />
		<div className="flex-1 w-full lg:pl-[280px]">
			<div className="p-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] lg:p-8">
				<Header />
				<main className="mt-6"><Outlet /></main>
				<Footer />
			</div>
		</div>
	</div>
);

export default StudentLayout;
