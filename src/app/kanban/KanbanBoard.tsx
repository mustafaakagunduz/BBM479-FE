"use client"
import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Card, CardContent, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Menu, MenuItem, Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, differenceInDays, startOfDay } from 'date-fns';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { DeleteIcon } from "lucide-react";

// Interfaces
interface Task {
    id: string;
    title: string;
    description: string;
    points?: number;
    duration?: string;
    reward?: string;
    notes?: string;
    dueDate?: string;
}

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
    dueDate: string;
}

interface SelectedTask extends Task {
    columnId: string;
    columnStatus?: string;
}

interface NewTaskForm {
    title: string;
    description: string;
    column: string;
    points: number | '';
}

// Styled Components
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

const KanbanBoard: React.FC = () => {
    const today = startOfDay(new Date());
    const [columns, setColumns] = useState<Columns>(() => {
        const savedData = localStorage.getItem('kanbanData');
        return savedData ? JSON.parse(savedData) : {
            todo: { title: 'Yapılacaklar', items: [] },
            inProgress: { title: 'Devam Edenler', items: [] },
            done: { title: 'Tamamlananlar', items: [] }
        };
    });

    const [rewards, setRewards] = useState<Reward[]>([
        { id: '1', title: 'Netflix Premium (1 Ay)', points: 100 },
        { id: '2', title: '2 Saat Extra Mola', points: 50 },
        { id: '3', title: 'Erken Çıkış Hakkı', points: 75 },
    ]);

    // State declarations
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [newTask, setNewTask] = useState<NewTaskForm>({ title: '', description: '', column: '', points: '' });
    const [newReward, setNewReward] = useState<{title: string, points: number | ''}>({ title: '', points: '' });
    const [progressDetails, setProgressDetails] = useState<ProgressDetails>({
        duration: '', reward: '', notes: '', dueDate: ''
    });
    const [movingTask, setMovingTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState<SelectedTask | null>(null);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [currentReward, setCurrentReward] = useState<string>('');
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    // Dialog states
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editDialog, setEditDialog] = useState<boolean>(false);
    const [newRewardDialog, setNewRewardDialog] = useState<boolean>(false);
    const [editRewardDialog, setEditRewardDialog] = useState<boolean>(false);
    const [openProgressDialog, setOpenProgressDialog] = useState<boolean>(false);
    const [rewardDialog, setRewardDialog] = useState<boolean>(false);
    const [taskDetailsDialog, setTaskDetailsDialog] = useState<boolean>(false);

    // Effects
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

    // Handler functions
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task, columnId: string): void => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedTask({ ...task, columnId });
    };

    const handleTaskClick = (task: Task, columnId: string): void => {
        setSelectedTaskDetails({ ...task, columnStatus: columns[columnId].title, columnId });
        setTaskDetailsDialog(true);
    };

    const handleEditReward = (reward: Reward) => {
        setEditingReward(reward);
        setNewReward({ title: reward.title, points: reward.points });
        setEditRewardDialog(true);
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
        setAnchorEl(null);
    };

    const handleEditClick = (): void => {
        if (!selectedTask) return;

        setEditTitle(selectedTask.title);
        setEditDescription(selectedTask.description || '');
        setEditDialog(true); // Bu satır mevcut
        setAnchorEl(null);
    };

    const handleEditSave = (): void => {
        if (!selectedTask || !editTitle.trim()) return;

        const updatedTask = {
            ...selectedTask,
            title: editTitle,
            description: editDescription.trim()
        };

        setColumns(prev => ({
            ...prev,
            [selectedTask.columnId]: {
                ...prev[selectedTask.columnId],
                items: prev[selectedTask.columnId].items.map(item =>
                    item.id === selectedTask.id ? updatedTask : item
                )
            }
        }));

        setEditDialog(false);
        setSelectedTask(null);
        setEditTitle('');
        setEditDescription('');
        setAnchorEl(null); // Menu'yü kapatma eklendi
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string, sourceColumn: string): void => {
        e.dataTransfer.setData('taskId', id);
        e.dataTransfer.setData('sourceColumn', sourceColumn);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumn: string): void => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn === targetColumn) return;

        const task = columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        setMovingTask(task);

        if (sourceColumn === 'todo' && targetColumn === 'inProgress') {
            setOpenProgressDialog(true);
        } else if (sourceColumn === 'inProgress' && targetColumn === 'done') {
            handleTaskCompletion(task, sourceColumn, targetColumn);
        } else {
            moveTask(sourceColumn, targetColumn, taskId);
        }
    };

    const handleTaskCompletion = (task: Task, sourceColumn: string, targetColumn: string) => {
        if (task.points) {
            // @ts-ignore
            setTotalPoints(prev => prev + task.points);
        }
        setCurrentReward(task.reward || '');
        setRewardDialog(true);
        moveTask(sourceColumn, targetColumn, task.id, { reward: task.reward });
    };

    const handleAddTask = (): void => {
        if (!newTask.column) return;

        const task: Task = {
            id: Math.random().toString(36).slice(2, 11),
            title: newTask.title,
            description: newTask.description,
            points: typeof newTask.points === 'number' ? newTask.points : 0
        };

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

    const handleProgressSubmit = (): void => {
        if (!movingTask) return;
        moveTask('todo', 'inProgress', movingTask.id, progressDetails);
        setOpenProgressDialog(false);
        setProgressDetails({ duration: '', reward: '', notes: '', dueDate: '' });
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

    const renderTaskCard = (task: Task, columnId: string) => {
        const daysLeft = task.dueDate ? differenceInDays(new Date(task.dueDate), today) : null;

        return (
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
                                onClick={(e) => handleMenuOpen(e, task, columnId)}
                                sx={{ color: 'primary.contrastText' }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Typography variant="body2">{task.description}</Typography>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'primary.contrastText' }}>
                            Puan: {task.points || 0}
                        </Typography>
                        {daysLeft !== null && (
                            <Typography variant="body2" sx={{
                                color: daysLeft < 0 ? 'error.main' : 'primary.contrastText'
                            }}>
                                {daysLeft < 0 ? 'Gecikme: ' : 'Kalan: '}
                                {Math.abs(daysLeft)} gün
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </TaskCard>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        {format(today, 'dd/MM/yyyy')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        Puanım: {totalPoints}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Box sx={{ mb: 3 }}>
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
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                            {Object.entries(columns).map(([columnId, column]) => (
                                <KanbanColumn
                                    key={columnId}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, columnId)}
                                    sx={{ flex: 1 }}
                                >
                                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.dark', fontWeight: 'bold' }}>
                                        {column.title}
                                    </Typography>
                                    {column.items.map(task => renderTaskCard(task, columnId))}
                                </KanbanColumn>
                            ))}

                            <KanbanColumn sx={{ flex: 1 }}>
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
                </Box>

                {/* Dialogs */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={handleEditClick}>Düzenle</MenuItem>
                    <MenuItem onClick={handleDeleteTask}>Sil</MenuItem>
                </Menu>

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

                <Dialog open={openProgressDialog} onClose={() => setOpenProgressDialog(false)}>
                    <DialogTitle>{movingTask?.title}</DialogTitle>
                    <DialogContent>
                        <TextField
                            type="date"
                            margin="dense"
                            label="Bitiş tarihini seçiniz"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                min: format(today, 'yyyy-MM-dd'),
                                style: { fontSize: '16px', padding: '12px' }
                            }}
                            value={progressDetails.dueDate}
                            onChange={(e) => setProgressDetails(prev => ({ ...prev, dueDate: e.target.value }))}
                            sx={{
                                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                    width: '20px',
                                    height: '20px'
                                }
                            }}
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
                        <Button onClick={() => {
                            if (editingReward && newReward.title && typeof newReward.points === 'number') {
                                setRewards(prev => prev.map(reward =>
                                    reward.id === editingReward.id
                                        ? { ...reward, title: newReward.title, points: newReward.points as number }
                                        : reward
                                ));
                                setEditRewardDialog(false);
                                setEditingReward(null);
                                setNewReward({ title: '', points: '' });
                            }
                        }} variant="contained">
                            Kaydet
                        </Button>
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
                        <TextField
                            type="number"
                            margin="dense"
                            label="Puan"
                            fullWidth
                            value={selectedTask?.points || 0}
                            onChange={(e) => {
                                if (selectedTask) {
                                    setSelectedTask({
                                        ...selectedTask,
                                        points: Number(e.target.value)
                                    });
                                }
                            }}
                        />
                        {selectedTask?.dueDate && (
                            <TextField
                                type="date"
                                margin="dense"
                                label="Bitiş Tarihi"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={selectedTask.dueDate}
                                onChange={(e) => {
                                    if (selectedTask) {
                                        setSelectedTask({
                                            ...selectedTask,
                                            dueDate: e.target.value
                                        });
                                    }
                                }}
                            />
                        )}
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
                            {selectedTaskDetails?.dueDate && (
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Bitiş Tarihi: {format(new Date(selectedTaskDetails.dueDate), 'dd/MM/yyyy')}
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
            </MainCard>
        </Container>
    );
};

export default KanbanBoard;