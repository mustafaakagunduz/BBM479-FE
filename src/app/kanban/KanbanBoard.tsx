"use client"
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Menu,
    MenuItem,
    Container,

} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import {DeleteIcon} from "lucide-react";

const MainCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(3),
    margin: '20px auto',
    minHeight: '80vh',
    maxWidth: '1200px',
    width: '90%',
}));

const KanbanColumn = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(2),
    minHeight: '500px',
    flex: 1,
    margin: theme.spacing(1),
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const TaskCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    position: 'relative',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderRadius: '8px',
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
}));

interface Reward {
    id: string;
    title: string;
    points: number;
}


interface ColumnData {
    title: string;
    items: Task[];
}

interface Columns {
    [key: string]: ColumnData;
}


interface ProgressDetails {
    duration: string;
    reward: string;
    notes: string;
}

interface SelectedTask extends Task {
    columnId: string;
    columnStatus?: string;
}

// Yeni interface ve state eklemeleri:
interface KanbanState {
    points: number;
}

interface Task {
    id: string;
    title: string;
    description: string;
    points?: number;
    duration?: string;
    reward?: string;
    notes?: string;
}

interface NewTaskForm {
    title: string;
    description: string;
    column: string;
    points: number | '';
}





const KanbanBoard: React.FC = () => {
    const [rewards, setRewards] = useState<Reward[]>([
        { id: '1', title: 'Netflix Premium (1 Ay)', points: 100 },
        { id: '2', title: '2 Saat Extra Mola', points: 50 },
        { id: '3', title: 'Erken Çıkış Hakkı', points: 75 },
    ]);
    const [newReward, setNewReward] = useState<{title: string, points: number | ''}>({
        title: '',
        points: ''
    });
    const [columns, setColumns] = useState<Columns>(() => {
        const savedData = localStorage.getItem('kanbanData');
        return savedData ? JSON.parse(savedData) : {
            todo: {
                title: 'Yapılacaklar',
                items: [
                    { id: '1', title: 'Proje planlaması', description: 'Yeni projenin detaylı planlaması yapılacak' }
                ]
            },
            inProgress: {
                title: 'Devam Edenler',
                items: []
            },
            done: {
                title: 'Tamamlananlar',
                items: []
            }
        };
    });
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openProgressDialog, setOpenProgressDialog] = useState<boolean>(false);
    const [newTask, setNewTask] = useState<NewTaskForm>({
        title: '',
        description: '',
        column: '',
        points: ''
    });
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [progressDetails, setProgressDetails] = useState<ProgressDetails>({ duration: '', reward: '', notes: '' });
    const [movingTask, setMovingTask] = useState<Task | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
    const [editDialog, setEditDialog] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [rewardDialog, setRewardDialog] = useState<boolean>(false);
    const [currentReward, setCurrentReward] = useState<string>('');
    const [taskDetailsDialog, setTaskDetailsDialog] = useState<boolean>(false);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState<SelectedTask | null>(null);

    //-------------------------
    const [newRewardDialog, setNewRewardDialog] = useState(false);
    const [editRewardDialog, setEditRewardDialog] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    //-------------------------

    useEffect(() => {
        const savedPoints = localStorage.getItem('totalPoints');
        const savedRewards = localStorage.getItem('rewards');

        if (savedPoints) setTotalPoints(Number(savedPoints));
        if (savedRewards) setRewards(JSON.parse(savedRewards));
    }, []);

    useEffect(() => {
        localStorage.setItem('kanbanData', JSON.stringify(columns));
        localStorage.setItem('totalPoints', String(totalPoints));
        localStorage.setItem('rewards', JSON.stringify(rewards));
    }, [columns, totalPoints, rewards]);

    // Menu handlers
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, task: Task, columnId: string): void => {
        setAnchorEl(event.currentTarget);
        setSelectedTask({ ...task, columnId });
    };

    const handleTaskClick = (task: Task, columnId: string): void => {
        setSelectedTaskDetails({ ...task, columnStatus: columns[columnId].title, columnId });
        setTaskDetailsDialog(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditReward = (reward: Reward) => {
        setEditingReward(reward);
        setNewReward({ title: reward.title, points: reward.points });
        setEditRewardDialog(true);
    };

    const handleSaveRewardEdit = () => {
        if (!editingReward || !newReward.title || typeof newReward.points !== 'number') return;

        setRewards(prev => prev.map(reward =>
            reward.id === editingReward.id
                ? { ...reward, title: newReward.title, points: newReward.points as number }
                : reward
        ));
        setEditRewardDialog(false);
        setEditingReward(null);
        setNewReward({ title: '', points: '' });
    };

    const handleDeleteReward = (id: string) => {
        setRewards(prev => prev.filter(reward => reward.id !== id));
    };

    const handleDeleteTask = (): void => {
        if (!selectedTask) return;

        setColumns(prev => ({
            ...prev,
            [selectedTask.columnId]: {
                ...prev[selectedTask.columnId],
                items: prev[selectedTask.columnId].items.filter(item => item.id !== selectedTask.id)
            }
        }));
        handleMenuClose();
    };

    const handleEditClick = (): void => {
        if (!selectedTask) return;

        setEditTitle(selectedTask.title);
        setEditDescription(selectedTask.description || '');
        setEditDialog(true);
        handleMenuClose();
    };

    const handleEditSave = (): void => {
        if (!selectedTask) return;

        setColumns(prev => ({
            ...prev,
            [selectedTask.columnId]: {
                ...prev[selectedTask.columnId],
                items: prev[selectedTask.columnId].items.map(item =>
                    item.id === selectedTask.id
                        ? { ...item, title: editTitle, description: editDescription }
                        : item
                )
            }
        }));
        setEditDialog(false);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string, sourceColumn: string): void => {
        e.dataTransfer.setData('taskId', id);
        e.dataTransfer.setData('sourceColumn', sourceColumn);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumn: string): void => {
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn === targetColumn) return;

        const task = columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        setMovingTask(task);

        if (sourceColumn === 'inProgress' && targetColumn === 'done') {
            const foundTask = columns[sourceColumn].items.find(item => item.id === taskId);
            if (foundTask?.points) {
                // @ts-ignore
                setTotalPoints(prev => prev + foundTask.points);
            }
            const reward = foundTask?.reward;
            setCurrentReward(reward || '');
            setRewardDialog(true);
            moveTask(sourceColumn, targetColumn, taskId, { reward });
        } else if (sourceColumn === 'todo' && targetColumn === 'inProgress') {
            setOpenProgressDialog(true);
        } else {
            moveTask(sourceColumn, targetColumn, taskId);
        }
    };

    const handleAddTask = (): void => {
        const task: Task = {
            id: Math.random().toString(36).slice(2, 11),
            title: newTask.title,
            description: newTask.description,
            points: typeof newTask.points === 'number' ? newTask.points : 0
        };

        if (!newTask.column) return;

        setColumns(prev => ({
            ...prev,
            [newTask.column]: {
                ...prev[newTask.column],
                items: [...prev[newTask.column].items, task]
            }
        }));

        setNewTask({ title: '', description: '', column: '', points: '' });
        setOpenDialog(false);
    };

    const moveTask = (sourceColumn: string, targetColumn: string, taskId: string, additionalData: Partial<Task> = {}): void => {
        const task = columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        const updatedTask = { ...task, ...additionalData };

        setColumns(prev => ({
            ...prev,
            [sourceColumn]: {
                ...prev[sourceColumn],
                items: prev[sourceColumn].items.filter(item => item.id !== taskId)
            },
            [targetColumn]: {
                ...prev[targetColumn],
                items: [...prev[targetColumn].items, updatedTask]
            }
        }));
    };

    const handleProgressSubmit = (): void => {
        if (!movingTask) return;
        moveTask('todo', 'inProgress', movingTask.id, progressDetails);
        setOpenProgressDialog(false);
        setProgressDetails({ duration: '', reward: '', notes: '' });
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <MainCard>
                <Box sx={{ display: 'flex' }}>
                    {/* Sol Taraf - Ana Kanban */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenDialog(true)}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.dark',
                                    '&:hover': { bgcolor: 'grey.100' }
                                }}
                            >
                                Yeni Görev
                            </Button>
                            <Typography variant="h6" sx={{ color: 'white' }}>
                                Puanım: {totalPoints}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                            {Object.entries(columns).map(([columnId, column]) => (
                                <KanbanColumn
                                    key={columnId}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, columnId)}
                                >
                                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.dark', fontWeight: 'bold' }}>
                                        {column.title}
                                    </Typography>
                                    {column.items.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task.id, columnId)}
                                        >
                                            <CardContent
                                                onClick={() => handleTaskClick(task, columnId)}
                                                sx={{ cursor: 'pointer', pb: '16px !important', position: 'relative' }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    mb: 1
                                                }}>
                                                    <Typography variant="h6" sx={{ pr: 4 }}>{task.title}</Typography>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        position: 'absolute',
                                                        right: 16,
                                                        top: 16,
                                                        gap: 0.5
                                                    }}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: 'primary.contrastText',
                                                                cursor: 'grab',
                                                                '&:active': { cursor: 'grabbing' }
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <DragHandleIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMenuOpen(e, task, columnId);
                                                            }}
                                                            sx={{ color: 'primary.contrastText' }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2">{task.description}</Typography>
                                                <Typography variant="body2" sx={{ mt: 1, color: 'primary.contrastText' }}>
                                                    Puan: {task.points || 0}
                                                </Typography>
                                            </CardContent>
                                        </TaskCard>
                                    ))}
                                </KanbanColumn>
                            ))}
                        </Box>
                    </Box>

                    {/* Sağ Taraf - Ödüller Kartı */}
                    <Box sx={{ width: 300, ml: 2 }}>
                        <KanbanColumn>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
                                    Ödüller
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setNewRewardDialog(true)}
                                    sx={{ bgcolor: 'primary.main', color: 'white' }}
                                >
                                    Yeni Ödül
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {rewards.map(reward => (
                                    <Card key={reward.id} sx={{ bgcolor: 'primary.light' }}>
                                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography color="white" variant="subtitle1">{reward.title}</Typography>
                                                    <Typography color="white" variant="body2">{reward.points} Puan</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        disabled={totalPoints < reward.points}
                                                        onClick={() => setTotalPoints(prev => prev - reward.points)}
                                                        sx={{ bgcolor: 'white', color: 'primary.dark', minWidth: 'auto' }}
                                                    >
                                                        Kullan
                                                    </Button>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditReward(reward)}
                                                        sx={{ color: 'white', p: 0.5 }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteReward(reward.id)}
                                                        sx={{ color: 'white', p: 0.5 }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </KanbanColumn>
                    </Box>
                </Box>

                {/* Menus */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEditClick}>Düzenle</MenuItem>
                    <MenuItem onClick={handleDeleteTask}>Sil</MenuItem>
                </Menu>

                {/* Task Related Dialogs */}
                <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
                    <DialogTitle>Görevi Düzenle</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Görev Başlığı"
                            fullWidth
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Görev Açıklaması"
                            fullWidth
                            multiline
                            rows={4}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialog(false)}>İptal</Button>
                        <Button onClick={handleEditSave} variant="contained">Kaydet</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={taskDetailsDialog} onClose={() => setTaskDetailsDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Görev Detayları</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">{selectedTaskDetails?.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Durum: {selectedTaskDetails?.columnStatus}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>Açıklama:</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>{selectedTaskDetails?.description}</Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>Puan: {selectedTaskDetails?.points || 0}</Typography>
                            {selectedTaskDetails?.duration && (
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    İşin Süresi: {selectedTaskDetails.duration}
                                </Typography>
                            )}
                            {selectedTaskDetails?.reward && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Ödül: {selectedTaskDetails.reward}
                                </Typography>
                            )}
                            {selectedTaskDetails?.notes && (
                                <>
                                    <Typography variant="body1" sx={{ mt: 2 }}>Notlar:</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>{selectedTaskDetails.notes}</Typography>
                                </>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setTaskDetailsDialog(false)}>Kapat</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Yeni Görev Ekle</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Görev Başlığı"
                            fullWidth
                            value={newTask.title}
                            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <TextField
                            margin="dense"
                            label="Görev Açıklaması"
                            fullWidth
                            multiline
                            rows={4}
                            value={newTask.description}
                            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <TextField
                            type="number"
                            margin="dense"
                            label="Puan"
                            fullWidth
                            value={newTask.points}
                            onChange={(e) => setNewTask(prev => ({
                                ...prev,
                                points: e.target.value === '' ? '' : Number(e.target.value)
                            }))}
                        />
                        <TextField
                            select
                            margin="dense"
                            label="Kolon"
                            fullWidth
                            value={newTask.column}
                            onChange={(e) => setNewTask(prev => ({ ...prev, column: e.target.value }))}
                            SelectProps={{ native: true }}
                        >
                            <option value="" disabled></option>
                            {Object.entries(columns).map(([columnId, column]) => (
                                <option key={columnId} value={columnId}>{column.title}</option>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>İptal</Button>
                        <Button onClick={handleAddTask} variant="contained">Ekle</Button>
                    </DialogActions>
                </Dialog>

                {/* Reward Related Dialogs */}
                <Dialog open={newRewardDialog} onClose={() => setNewRewardDialog(false)}>
                    <DialogTitle>Yeni Ödül Ekle</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Ödül Başlığı"
                            fullWidth
                            value={newReward.title}
                            onChange={(e) => setNewReward(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <TextField
                            type="number"
                            margin="dense"
                            label="Puan"
                            fullWidth
                            value={newReward.points}
                            onChange={(e) => setNewReward(prev => ({
                                ...prev,
                                points: e.target.value === '' ? '' : Number(e.target.value)
                            }))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setNewRewardDialog(false)}>İptal</Button>
                        <Button onClick={() => {
                            if (newReward.title && typeof newReward.points === 'number') {
                                setRewards(prev => [...prev, {
                                    id: Math.random().toString(36).slice(2, 11),
                                    title: newReward.title,
                                    points: newReward.points as number
                                }]);
                                setNewRewardDialog(false);
                                setNewReward({ title: '', points: '' });
                            }
                        }} variant="contained">
                            Ekle
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={editRewardDialog} onClose={() => setEditRewardDialog(false)}>
                    <DialogTitle>Ödül Düzenle</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Ödül Başlığı"
                            fullWidth
                            value={newReward.title}
                            onChange={(e) => setNewReward(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <TextField
                            type="number"
                            margin="dense"
                            label="Puan"
                            fullWidth
                            value={newReward.points}
                            onChange={(e) => setNewReward(prev => ({
                                ...prev,
                                points: e.target.value === '' ? '' : Number(e.target.value)
                            }))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditRewardDialog(false)}>İptal</Button>
                        <Button onClick={handleSaveRewardEdit} variant="contained">
                            Kaydet
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openProgressDialog} onClose={() => setOpenProgressDialog(false)}>
                    <DialogTitle>{movingTask?.title}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="İşin Süresi"
                            fullWidth
                            value={progressDetails.duration}
                            onChange={(e) => setProgressDetails(prev => ({ ...prev, duration: e.target.value }))}
                        />
                        <TextField
                            margin="dense"
                            label="Ödül"
                            fullWidth
                            value={progressDetails.reward}
                            onChange={(e) => setProgressDetails(prev => ({ ...prev, reward: e.target.value }))}
                        />
                        <TextField
                            margin="dense"
                            label="Notlar"
                            fullWidth
                            multiline
                            rows={4}
                            value={progressDetails.notes}
                            onChange={(e) => setProgressDetails(prev => ({ ...prev, notes: e.target.value }))}
                                />
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={() => setOpenProgressDialog(false)}>İptal</Button>
                        <Button onClick={handleProgressSubmit} variant="contained">Kaydet</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={rewardDialog} onClose={() => setRewardDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center' }}>🎉 Tebrikler! 🎉</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6" sx={{ textAlign: 'center', my: 2 }}>
                            [{currentReward}] kazandınız!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRewardDialog(false)} variant="contained" fullWidth>
                            Tamam
                        </Button>
                    </DialogActions>
                </Dialog>
            </MainCard>
        </Container>
    );


};

export default KanbanBoard;