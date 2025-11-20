import { Router } from 'express';
import userRoutes from '@modules/user/routes/user_routes';
import projectRoutes from '@modules/project/routes/project_routes';
import blogRoutes from '@modules/blog/routes/blog_routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/project', projectRoutes);
router.use('/blog', blogRoutes);

export default router;
